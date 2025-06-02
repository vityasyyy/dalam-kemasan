package repositories

import (
	"service/internal/logger"
	"service/internal/models"
	"time"

	"github.com/jmoiron/sqlx"
)

// Must implement all methods in the interface
type AuthRepo interface {
	CreateUser(user *models.User) error
	GetUserByEmail(email string) (*models.User, error)
	GetUserByID(userID int) (*models.User, error)
	ResetPassword(newPassword, resetToken string) error
	RequestingPasswordReset(email, resetToken string, resetTokenExpiredAt time.Time) error
	UpgradeUserPackage(userID int, newPackage string) error
	SetPackageExpiry(userID int, expiryTime time.Time) error
	GetExpiredPremiumUsers() ([]int, error)
	ClearPackageExpiry(userID int) error
}

type authRepo struct {
	db *sqlx.DB // Depends on a database connection
}

// Constructor for authRepo that returns the interface
func NewAuthRepo(db *sqlx.DB) AuthRepo {
	// return the pointer to a struct with the database connection
	return &authRepo{db: db}
}

// This function implements the CreateUser method from the AuthRepo interface, it creates a new user in the database, accepts the user models as the params, and returns an error if the query fails
func (r *authRepo) CreateUser(user *models.User) error {
	query := "INSERT INTO users (email, username, password, package, free_storage_used, free_storage_limit, premium_storage_used, premium_storage_limit) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id"
	err := r.db.QueryRow(query, user.Email, user.Username, user.Password, user.Package, 0, 2097152, 0, 5242880).Scan(&user.UserID)
	if err != nil {
		// Log the error if the query fails
		logger.LogError(err, "Failed to create user", map[string]interface{}{"layer": "repository", "operation": "CreateUser"})
		return err
	}
	// Log the success if the query succeeds (this wont be logged in production)
	logger.LogDebug("User created", map[string]interface{}{"layer": "repository", "operation": "CreateUser"})
	return nil
}

func (r *authRepo) GetUserByEmail(email string) (*models.User, error) {
	// Create a new user struct to store the result
	var user models.User
	query := "SELECT user_id, email, username, password, package, free_storage_used, free_storage_limit, premium_storage_used, premium_storage_limit, package_expiry FROM users WHERE email = $1"
	// Get the user struct from the database using the query and the username
	err := r.db.Get(&user, query, email)
	if err != nil {
		logger.LogError(err, "Failed to get user", map[string]interface{}{"layer": "repository", "operation": "GetUserByEmail"})
		return nil, err
	}
	logger.LogDebug("User retrieved", map[string]interface{}{"layer": "repository", "operation": "GetUserByEmail"})
	return &user, nil
}

func (r *authRepo) GetUserByID(userID int) (*models.User, error) {
	var user models.User
	query := "SELECT user_id, email, username, password, package, free_storage_used, free_storage_limit, premium_storage_used, premium_storage_limit, package_expiry FROM users WHERE user_id = $1"
	err := r.db.Get(&user, query, userID)
	if err != nil {
		logger.LogError(err, "Failed to get user", map[string]interface{}{"layer": "repository", "operation": "GetUserByID"})
		return nil, err
	}
	logger.LogDebug("User retrieved", map[string]interface{}{"layer": "repository", "operation": "GetUserByID"})
	return &user, nil
}

func (r *authRepo) ResetPassword(newPassword, resetToken string) error {
	query := "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = $2 AND reset_token_expiry > CURRENT_TIMESTAMP"
	_, err := r.db.Exec(query, newPassword, resetToken)
	if err != nil {
		logger.LogError(err, "Failed to reset password", map[string]interface{}{"layer": "repository", "operation": "ResetPassword"})
		return err
	}
	logger.LogDebug("Password reset", map[string]interface{}{"layer": "repository", "operation": "ResetPassword"})
	return nil
}

func (r *authRepo) RequestingPasswordReset(email, resetToken string, resetTokenExpiredAt time.Time) error {
	query := "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3"
	_, err := r.db.Exec(query, resetToken, resetTokenExpiredAt, email)
	if err != nil {
		logger.LogError(err, "Failed to request password reset", map[string]interface{}{"layer": "repository", "operation": "RequestingPasswordReset"})
		return err
	}
	logger.LogDebug("Password reset requested", map[string]interface{}{"layer": "repository", "operation": "RequestingPasswordReset"})
	return nil
}

func (r *authRepo) UpgradeUserPackage(userID int, newPackage string) error {
	query := "UPDATE users SET package = $1 WHERE user_id = $2"
	_, err := r.db.Exec(query, newPackage, userID)
	if err != nil {
		logger.LogError(err, "Failed to upgrade user package", map[string]interface{}{"layer": "repository", "operation": "UpgradeUserPackage", "userID": userID, "newPackage": newPackage})
		return err
	}
	logger.LogDebug("User package upgraded", map[string]interface{}{"layer": "repository", "operation": "UpgradeUserPackage", "userID": userID, "newPackage": newPackage})
	return nil
}

func (r *authRepo) SetPackageExpiry(userID int, expiryTime time.Time) error {
	query := "UPDATE users SET package_expiry = $1 WHERE user_id = $2"
	_, err := r.db.Exec(query, expiryTime, userID)
	if err != nil {
		logger.LogError(err, "Failed to set package expiry", map[string]interface{}{"layer": "repository", "operation": "SetPackageExpiry", "userID": userID})
		return err
	}
	logger.LogDebug("Package expiry set", map[string]interface{}{"layer": "repository", "operation": "SetPackageExpiry", "userID": userID})
	return nil
}

func (r *authRepo) GetExpiredPremiumUsers() ([]int, error) {
	var userIDs []int
	query := "SELECT user_id FROM users WHERE package = 'premium' AND package_expiry IS NOT NULL AND package_expiry < CURRENT_TIMESTAMP"
	err := r.db.Select(&userIDs, query)
	if err != nil {
		logger.LogError(err, "Failed to get expired premium users", map[string]interface{}{"layer": "repository", "operation": "GetExpiredPremiumUsers"})
		return nil, err
	}
	logger.LogDebug("Retrieved expired premium users", map[string]interface{}{"layer": "repository", "operation": "GetExpiredPremiumUsers", "count": len(userIDs)})
	return userIDs, nil
}

func (r *authRepo) ClearPackageExpiry(userID int) error {
	query := "UPDATE users SET package_expiry = NULL WHERE user_id = $1"
	_, err := r.db.Exec(query, userID)
	if err != nil {
		logger.LogError(err, "Failed to clear package expiry", map[string]interface{}{"layer": "repository", "operation": "ClearPackageExpiry", "userID": userID})
		return err
	}
	logger.LogDebug("Package expiry cleared", map[string]interface{}{"layer": "repository", "operation": "ClearPackageExpiry", "userID": userID})
	return nil
}
