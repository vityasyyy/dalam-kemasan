package models

import "time"

type File struct {
	FileID              int       `db:"file_id" json:"file_id"`
	UserID              int       `db:"user_id" json:"user_id"`
	FileName            string    `db:"file_name" json:"file_name" binding:"required"`
	FileSize            int64     `db:"file_size" json:"file_size" binding:"required"`
	S3ObjectKey         string    `db:"s3_object_key" json:"s3_object_key"`
	ContentType         string    `db:"content_type" json:"content_type" binding:"required"`
	UploadedWithPackage string    `db:"uploaded_with_package" json:"uploaded_with_package"`
	CreatedAt           time.Time `db:"created_at" json:"created_at"`
}

type UserStorage struct {
	UserID       int   `json:"user_id" db:"user_id"`
	StorageUsed  int64 `json:"storage_used" db:"storage_used"`
	StorageLimit int64 `json:"storage_limit" db:"storage_limit"`
}
