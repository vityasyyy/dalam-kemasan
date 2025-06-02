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
	UserID              int   `json:"user_id" db:"user_id"`
	FreeStorageUsed     int64 `json:"free_storage_used" db:"free_storage_used"`
	FreeStorageLimit    int64 `json:"free_storage_limit" db:"free_storage_limit"`
	PremiumStorageUsed  int64 `json:"premium_storage_used" db:"premium_storage_used"`
	PremiumStorageLimit int64 `json:"premium_storage_limit" db:"premium_storage_limit"`
}
