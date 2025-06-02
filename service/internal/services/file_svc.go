package services

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"
	"service/internal/models"
	"service/internal/repositories"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type FileService interface {
	UploadFile(ctx context.Context, userID int, fileHeader *multipart.FileHeader, currentUserPackage string) (*models.File, error)
	DownloadFile(ctx context.Context, userID int, fileID int, currentUserPackage string) (*minio.Object, *models.File, error)
	DeleteFile(ctx context.Context, userID int, fileID int) error
	GetUserStorageInfo(userID int) (*models.UserStorage, error)
	ListUserFiles(userID int) ([]*models.File, error)
}

type fileService struct {
	fileRepo    repositories.FileRepo
	authRepo    repositories.AuthRepo
	minioClient *minio.Client
	bucketName  string
}

func NewFileService(fileRepo repositories.FileRepo, authRepo repositories.AuthRepo) (FileService, error) {
	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKeyID := os.Getenv("MINIO_ACCESS_KEY_ID")
	secretAccessKey := os.Getenv("MINIO_SECRET_ACCESS_KEY")
	useSSL := os.Getenv("MINIO_USE_SSL") == "true"
	bucketName := os.Getenv("MINIO_BUCKET_NAME")

	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to initialize minio client: %w", err)
	}

	// Check if bucket exists and create if not
	ctx := context.Background()
	exists, err := minioClient.BucketExists(ctx, bucketName)
	if err != nil {
		return nil, fmt.Errorf("failed to check if bucket exists: %w", err)
	}
	if !exists {
		err = minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		if err != nil {
			return nil, fmt.Errorf("failed to create bucket: %w", err)
		}
	}

	return &fileService{
		fileRepo:    fileRepo,
		authRepo:    authRepo,
		minioClient: minioClient,
		bucketName:  bucketName,
	}, nil
}

// checkUserPackageValidity checks if user's premium package is still valid
func (s *fileService) checkUserPackageValidity(userID int) (string, bool, error) {
	user, err := s.authRepo.GetUserByID(userID)
	if err != nil {
		return "", false, fmt.Errorf("failed to get user: %w", err)
	}

	// If user has premium package, check expiry
	if user.Package == "premium" {
		if user.PackageExpiry != nil && time.Now().After(*user.PackageExpiry) {
			// Package has expired, treat as free user
			return "free", false, nil
		}
		return "premium", true, nil
	}

	return "free", true, nil
}

func (s *fileService) UploadFile(ctx context.Context, userID int, fileHeader *multipart.FileHeader, currentUserPackage string) (*models.File, error) {
	// Check if user's package is still valid
	actualPackage, isValid, err := s.checkUserPackageValidity(userID)
	if err != nil {
		return nil, err
	}

	if !isValid {
		return nil, fmt.Errorf("your premium package has expired. Please upgrade to continue uploading files")
	}

	// Check user storage limit based on actual package status
	userStorage, err := s.fileRepo.GetUserStorage(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user storage: %w", err)
	}

	// Determine which storage to use and check limits
	var currentStorageUsed, storageLimit int64
	if actualPackage == "premium" {
		currentStorageUsed = userStorage.PremiumStorageUsed
		storageLimit = userStorage.PremiumStorageLimit
	} else {
		currentStorageUsed = userStorage.FreeStorageUsed
		storageLimit = userStorage.FreeStorageLimit
	}

	if currentStorageUsed+fileHeader.Size > storageLimit {
		return nil, fmt.Errorf("storage limit exceeded. Available: %d bytes, File size: %d bytes", storageLimit-currentStorageUsed, fileHeader.Size)
	}

	file, err := fileHeader.Open()
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	s3ObjectKey := fmt.Sprintf("%d/%s", userID, fileHeader.Filename)

	_, err = s.minioClient.PutObject(ctx, s.bucketName, s3ObjectKey, file, fileHeader.Size, minio.PutObjectOptions{ContentType: fileHeader.Header.Get("Content-Type")})
	if err != nil {
		return nil, fmt.Errorf("failed to upload file to minio: %w", err)
	}

	fileMetadata := &models.File{
		UserID:              userID,
		FileName:            fileHeader.Filename,
		FileSize:            fileHeader.Size,
		S3ObjectKey:         s3ObjectKey,
		ContentType:         fileHeader.Header.Get("Content-Type"),
		UploadedWithPackage: actualPackage, // Use actual package status
	}

	if err := s.fileRepo.CreateFileMetadata(fileMetadata); err != nil {
		// Attempt to delete the object from Minio if DB insert fails
		_ = s.minioClient.RemoveObject(ctx, s.bucketName, s3ObjectKey, minio.RemoveObjectOptions{})
		return nil, fmt.Errorf("failed to create file metadata: %w", err)
	}

	if err := s.fileRepo.UpdateUserStorage(userID, fileHeader.Size, actualPackage); err != nil {
		// Attempt to delete the object from Minio and metadata if storage update fails
		_ = s.minioClient.RemoveObject(ctx, s.bucketName, s3ObjectKey, minio.RemoveObjectOptions{})
		_ = s.fileRepo.DeleteFileMetadata(fileMetadata.FileID, userID) // Assuming FileID is populated after CreateFileMetadata
		return nil, fmt.Errorf("failed to update user storage: %w", err)
	}

	return fileMetadata, nil
}

func (s *fileService) DownloadFile(ctx context.Context, userID int, fileID int, currentUserPackage string) (*minio.Object, *models.File, error) {
	// Check if user's package is still valid
	actualPackage, isValid, err := s.checkUserPackageValidity(userID)
	if err != nil {
		return nil, nil, err
	}

	fileMetadata, err := s.fileRepo.GetFileMetadata(fileID, userID)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to get file metadata: %w", err)
	}

	// Check access permissions based on file upload package and current package status
	if fileMetadata.UploadedWithPackage == "premium" {
		if actualPackage != "premium" {
			if !isValid {
				return nil, nil, fmt.Errorf("this file was uploaded with a premium package, but your premium subscription has expired. Please upgrade to premium to access it")
			} else {
				return nil, nil, fmt.Errorf("this file was uploaded with a premium package. Please upgrade to premium to access it")
			}
		}
	}

	object, err := s.minioClient.GetObject(ctx, s.bucketName, fileMetadata.S3ObjectKey, minio.GetObjectOptions{})
	if err != nil {
		return nil, nil, fmt.Errorf("failed to get object from minio: %w", err)
	}
	return object, fileMetadata, nil
}

func (s *fileService) DeleteFile(ctx context.Context, userID int, fileID int) error {
	// Check if user's package is still valid for modifications
	actualPackage, isValid, err := s.checkUserPackageValidity(userID)
	if err != nil {
		return err
	}

	fileMetadata, err := s.fileRepo.GetFileMetadata(fileID, userID)
	if err != nil {
		return fmt.Errorf("failed to get file metadata: %w", err)
	}

	// Check if user can delete this file based on package status
	if fileMetadata.UploadedWithPackage == "premium" {
		if actualPackage != "premium" {
			if !isValid {
				return fmt.Errorf("this file was uploaded with a premium package, but your premium subscription has expired. Please upgrade to premium to manage it")
			} else {
				return fmt.Errorf("this file was uploaded with a premium package. Please upgrade to premium to manage it")
			}
		}
	}

	err = s.minioClient.RemoveObject(ctx, s.bucketName, fileMetadata.S3ObjectKey, minio.RemoveObjectOptions{})
	if err != nil {
		return fmt.Errorf("failed to remove object from minio: %w", err)
	}

	if err := s.fileRepo.DeleteFileMetadata(fileID, userID); err != nil {
		// Potentially re-upload or log if DB deletion fails, as the S3 object is already deleted.
		return fmt.Errorf("failed to delete file metadata: %w", err)
	}

	// Update the appropriate storage based on the file's uploaded package
	if err := s.fileRepo.UpdateUserStorage(userID, -fileMetadata.FileSize, fileMetadata.UploadedWithPackage); err != nil {
		// This is problematic, as the file is deleted but storage isn't updated.
		// Log this error critically.
		return fmt.Errorf("CRITICAL: failed to update user storage after file deletion: %w", err)
	}

	return nil
}

func (s *fileService) GetUserStorageInfo(userID int) (*models.UserStorage, error) {
	// Check current package status
	_, _, err := s.checkUserPackageValidity(userID)
	if err != nil {
		return nil, err
	}

	userStorage, err := s.fileRepo.GetUserStorage(userID)
	if err != nil {
		return nil, err
	}

	return userStorage, nil
}

func (s *fileService) ListUserFiles(userID int) ([]*models.File, error) {
	// Check if user's package is still valid
	actualPackage, _, err := s.checkUserPackageValidity(userID)
	if err != nil {
		return nil, err
	}

	files, err := s.fileRepo.GetFilesMetadataByUser(userID)
	if err != nil {
		return nil, err
	}

	// Filter files based on current package status
	var accessibleFiles []*models.File
	for _, file := range files {
		// If file was uploaded with premium but user no longer has valid premium
		if file.UploadedWithPackage == "premium" && actualPackage != "premium" {
			// Skip premium files if user doesn't have valid premium access
			continue
		}
		accessibleFiles = append(accessibleFiles, file)
	}

	return accessibleFiles, nil
}
