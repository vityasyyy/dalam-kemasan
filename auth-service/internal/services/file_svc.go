package services

import (
	"auth-service/internal/models"
	"auth-service/internal/repositories"
	"context"
	"fmt"
	"mime/multipart"
	"os"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

const maxFileSize = 5 * 1024 * 1024 // 5MB

type FileService interface {
	UploadFile(ctx context.Context, userID int, fileHeader *multipart.FileHeader) (*models.File, error)
	DownloadFile(ctx context.Context, userID int, fileID int) (*minio.Object, *models.File, error)
	DeleteFile(ctx context.Context, userID int, fileID int) error
	GetUserStorageInfo(userID int) (*models.UserStorage, error)
	ListUserFiles(userID int) ([]*models.File, error)
}

type fileService struct {
	fileRepo    repositories.FileRepo
	minioClient *minio.Client
	bucketName  string
}

func NewFileService(fileRepo repositories.FileRepo) (FileService, error) {
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
		minioClient: minioClient,
		bucketName:  bucketName,
	}, nil
}

func (s *fileService) UploadFile(ctx context.Context, userID int, fileHeader *multipart.FileHeader) (*models.File, error) {
	// Check user storage limit
	userStorage, err := s.fileRepo.GetUserStorage(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user storage: %w", err)
	}

	if userStorage.StorageUsed+fileHeader.Size > userStorage.StorageLimit {
		return nil, fmt.Errorf("storage limit exceeded. Available: %d bytes, File size: %d bytes", userStorage.StorageLimit-userStorage.StorageUsed, fileHeader.Size)
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
		UserID:      userID,
		FileName:    fileHeader.Filename,
		FileSize:    fileHeader.Size,
		S3ObjectKey: s3ObjectKey,
		ContentType: fileHeader.Header.Get("Content-Type"),
	}

	if err := s.fileRepo.CreateFileMetadata(fileMetadata); err != nil {
		// Attempt to delete the object from Minio if DB insert fails
		_ = s.minioClient.RemoveObject(ctx, s.bucketName, s3ObjectKey, minio.RemoveObjectOptions{})
		return nil, fmt.Errorf("failed to create file metadata: %w", err)
	}

	if err := s.fileRepo.UpdateUserStorage(userID, fileHeader.Size); err != nil {
		// Attempt to delete the object from Minio and metadata if storage update fails
		_ = s.minioClient.RemoveObject(ctx, s.bucketName, s3ObjectKey, minio.RemoveObjectOptions{})
		_ = s.fileRepo.DeleteFileMetadata(fileMetadata.FileID, userID) // Assuming FileID is populated after CreateFileMetadata
		return nil, fmt.Errorf("failed to update user storage: %w", err)
	}

	return fileMetadata, nil
}

func (s *fileService) DownloadFile(ctx context.Context, userID int, fileID int) (*minio.Object, *models.File, error) {
	fileMetadata, err := s.fileRepo.GetFileMetadata(fileID, userID)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to get file metadata: %w", err)
	}

	object, err := s.minioClient.GetObject(ctx, s.bucketName, fileMetadata.S3ObjectKey, minio.GetObjectOptions{})
	if err != nil {
		return nil, nil, fmt.Errorf("failed to get object from minio: %w", err)
	}
	return object, fileMetadata, nil
}

func (s *fileService) DeleteFile(ctx context.Context, userID int, fileID int) error {
	fileMetadata, err := s.fileRepo.GetFileMetadata(fileID, userID)
	if err != nil {
		return fmt.Errorf("failed to get file metadata: %w", err)
	}

	err = s.minioClient.RemoveObject(ctx, s.bucketName, fileMetadata.S3ObjectKey, minio.RemoveObjectOptions{})
	if err != nil {
		return fmt.Errorf("failed to remove object from minio: %w", err)
	}

	if err := s.fileRepo.DeleteFileMetadata(fileID, userID); err != nil {
		// Potentially re-upload or log if DB deletion fails, as the S3 object is already deleted.
		return fmt.Errorf("failed to delete file metadata: %w", err)
	}

	if err := s.fileRepo.UpdateUserStorage(userID, -fileMetadata.FileSize); err != nil {
		// This is problematic, as the file is deleted but storage isn't updated.
		// Log this error critically.
		return fmt.Errorf("CRITICAL: failed to update user storage after file deletion: %w", err)
	}

	return nil
}

func (s *fileService) GetUserStorageInfo(userID int) (*models.UserStorage, error) {
	return s.fileRepo.GetUserStorage(userID)
}

func (s *fileService) ListUserFiles(userID int) ([]*models.File, error) {
	return s.fileRepo.GetFilesMetadataByUser(userID)
}
