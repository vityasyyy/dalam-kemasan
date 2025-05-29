package models

import "time"

type RefreshToken struct {
	RefreshTokenID    int       `db:"refresh_token_id" json:"refresh_token_id"`
	UserID            int       `db:"user_id" json:"user_id"`
	RefreshTokenValue string    `db:"refresh_token_value" json:"refresh_token_value" binding:"required"`
	ExpiredAt         time.Time `db:"expired_at" json:"expired_at" binding:"required"`
	CreatedAt         time.Time `db:"created_at" json:"created_at" binding:"required" default:"CURRENT_TIMESTAMP"`
	Revoked           bool      `db:"revoked" json:"revoked" binding:"required" default:"false"`
}
