package models

import "time"

type User struct {
	UserID              int        `db:"user_id" json:"user_id"`
	Email               string     `db:"email" json:"email" binding:"required,email"`
	Username            string     `db:"username" json:"username" binding:"required,max=100"`
	Password            string     `db:"password" json:"password" binding:"required,min=8"`
	ResetToken          string     `db:"reset_token" json:"reset_token"`
	ResetTokenExpiry    time.Time  `db:"reset_token_expiry" json:"reset_token_expiry"`
	Package             string     `db:"package" json:"package"`
	FreeStorageUsed     int64      `db:"free_storage_used" json:"free_storage_used"`
	FreeStorageLimit    int64      `db:"free_storage_limit" json:"free_storage_limit"`
	PremiumStorageUsed  int64      `db:"premium_storage_used" json:"premium_storage_used"`
	PremiumStorageLimit int64      `db:"premium_storage_limit" json:"premium_storage_limit"`
	PackageExpiry       *time.Time `db:"package_expiry" json:"package_expiry"`
}
