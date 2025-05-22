package repositories

import (
	"auth-service/internal/models"

	"github.com/jmoiron/sqlx"
)

type FileRepo interface {
	CreateFileMetadata(file *models.File) error
	GetFileMetadata(fileID int, userID int) (*models.File, error)
	GetFilesMetadataByUser(userID int) ([]*models.File, error)
	DeleteFileMetadata(fileID int, userID int) error
	UpdateUserStorage(userID int, fileSize int64) error
	GetUserStorage(userID int) (*models.UserStorage, error)
}

type fileRepo struct {
	db *sqlx.DB
}

func NewFileRepo(db *sqlx.DB) FileRepo {
	return &fileRepo{db: db}
}

func (r *fileRepo) CreateFileMetadata(file *models.File) error {
	query := "INSERT INTO files (user_id, file_name, file_size, s3_object_key, content_type, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING file_id"
	return r.db.QueryRowx(query, file.UserID, file.FileName, file.FileSize, file.S3ObjectKey, file.ContentType, file.CreatedAt).Scan(&file.FileID)
}

func (r *fileRepo) GetFileMetadata(fileID int, userID int) (*models.File, error) {
	file := &models.File{}
	query := "SELECT file_id, user_id, file_name, file_size, s3_object_key, content_type, created_at FROM files WHERE file_id = $1 AND user_id = $2"
	err := r.db.Get(file, query, fileID, userID)
	return file, err
}

func (r *fileRepo) GetFilesMetadataByUser(userID int) ([]*models.File, error) {
	var files []*models.File
	query := "SELECT file_id, user_id, file_name, file_size, s3_object_key, content_type, created_at FROM files WHERE user_id = $1"
	err := r.db.Select(&files, query, userID)
	return files, err
}

func (r *fileRepo) DeleteFileMetadata(fileID int, userID int) error {
	query := "DELETE FROM files WHERE file_id = $1 AND user_id = $2"
	_, err := r.db.Exec(query, fileID, userID)
	return err
}

func (r *fileRepo) UpdateUserStorage(userID int, fileSize int64) error {
	query := "UPDATE users SET storage_used = storage_used + $1 WHERE user_id = $2"
	_, err := r.db.Exec(query, fileSize, userID)
	return err
}

func (r *fileRepo) GetUserStorage(userID int) (*models.UserStorage, error) {
	storage := &models.UserStorage{}
	query := "SELECT user_id, storage_used, storage_limit FROM users WHERE user_id = $1"
	err := r.db.Get(storage, query, userID)
	return storage, err
}
