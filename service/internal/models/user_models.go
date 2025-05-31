package models

import "time"

type User struct {
	UserID           int        `db:"user_id" json:"user_id"`
	Email            string     `db:"email" json:"email" binding:"required,email"`
	Username         string     `db:"username" json:"username" binding:"required,max=100"`
	Password         string     `db:"password" json:"password" binding:"required,min=8"`
	ResetToken       string     `db:"reset_token" json:"reset_token"`
	ResetTokenExpiry time.Time  `db:"reset_token_expiry" json:"reset_token_expiry"`
	Package          string     `db:"package" json:"package"`
	StorageUsed      int64      `db:"storage_used" json:"storage_used"`
	StorageLimit     int64      `db:"storage_limit" json:"storage_limit"`
	PackageExpiry    *time.Time `db:"package_expiry" json:"package_expiry"`
}
