package repositories

import (
	"auth-service/internal/logger"
	"auth-service/internal/models"

	"github.com/jmoiron/sqlx"
)

type RefreshTokenRepo interface {
	StoreRefreshToken(refreshTokenStruct *models.RefreshToken) error
	RevokeRefreshToken(refreshTokenString string) error
	FindValidRefreshToken(refreshTokenString string) (*models.RefreshToken, error)
	RevokeBasedOnUserID(userID int) error
}

type refreshTokenRepo struct {
	db *sqlx.DB
}

func NewTokenRepository(db *sqlx.DB) RefreshTokenRepo {
	return &refreshTokenRepo{db: db}
}

func (r *refreshTokenRepo) StoreRefreshToken(refreshTokenStruct *models.RefreshToken) error {
	query := "INSERT INTO refresh_tokens (user_id, refresh_token_value, expired_at, created_at, revoked) VALUES ($1, $2, $3, $4, $5)"
	_, err := r.db.Exec(query, refreshTokenStruct.UserID, refreshTokenStruct.RefreshTokenValue, refreshTokenStruct.ExpiredAt, refreshTokenStruct.CreatedAt, refreshTokenStruct.Revoked)
	if err != nil {
		logger.LogError(err, "Failed to store refresh token", map[string]interface{}{"layer": "repository", "operation": "StoreRefreshToken"})
		return err
	}
	logger.LogDebug("Refresh token stored", map[string]interface{}{"layer": "repository", "operation": "StoreRefreshToken"})
	return nil
}

func (r *refreshTokenRepo) RevokeRefreshToken(refreshTokenString string) error {
	query := "UPDATE refresh_tokens SET revoked = true WHERE refresh_token_value = $1 AND revoked = false AND expired_at > CURRENT_TIMESTAMP"
	_, err := r.db.Exec(query, refreshTokenString)
	if err != nil {
		logger.LogError(err, "Failed to revoke refresh token", map[string]interface{}{"layer": "repository", "operation": "RevokeRefreshToken"})
		return err
	}
	logger.LogDebug("Refresh token revoked", map[string]interface{}{"layer": "repository", "operation": "RevokeRefreshToken"})
	return nil
}

func (r *refreshTokenRepo) FindValidRefreshToken(refreshTokenString string) (*models.RefreshToken, error) {
	var refreshToken models.RefreshToken
	query := "SELECT * FROM refresh_tokens WHERE refresh_token_value = $1 AND revoked = false AND expired_at > CURRENT_TIMESTAMP"
	err := r.db.Get(&refreshToken, query, refreshTokenString)
	if err != nil {
		logger.LogError(err, "Failed to find valid refresh token", map[string]interface{}{"layer": "repository", "operation": "FindValidRefreshToken"})
		return nil, err
	}
	logger.LogDebug("Refresh token found", map[string]interface{}{"layer": "repository", "operation": "FindValidRefreshToken"})
	return &refreshToken, nil
}

// RevokeBasedOnUserID(userUD int) error query := UPDATE refresh_tokens SET revoked = true WHERE user_id = $1 AND revoked = false AND expired_at > CURRENT_TIMESTAMP
func (r *refreshTokenRepo) RevokeBasedOnUserID(userID int) error {
	query := "UPDATE refresh_tokens SET revoked = true WHERE user_id = $1 AND revoked = false AND expired_at > CURRENT_TIMESTAMP"
	_, err := r.db.Exec(query, userID)
	if err != nil {
		logger.LogError(err, "Failed to revoke refresh token", map[string]interface{}{"layer": "repository", "operation": "RevokeBasedOnUserID"})
		return err
	}
	logger.LogDebug("Refresh token revoked", map[string]interface{}{"layer": "repository", "operation": "RevokeBasedOnUserID"})
	return nil
}
