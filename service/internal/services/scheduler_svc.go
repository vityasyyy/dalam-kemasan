package services

import (
	"service/internal/logger"
	"service/internal/repositories"
	"time"
)

type SchedulerService interface {
	CheckAndDowngradeExpiredPackages() (int, error)
	SchedulePackageExpiration(userID int, duration time.Duration) error
}

type schedulerService struct {
	authRepo repositories.AuthRepo
}

func NewSchedulerService(authRepo repositories.AuthRepo) SchedulerService {
	return &schedulerService{
		authRepo: authRepo,
	}
}

// SchedulePackageExpiration sets a package expiration time for a user
func (s *schedulerService) SchedulePackageExpiration(userID int, duration time.Duration) error {
	expiryTime := time.Now().Add(duration)
	err := s.authRepo.SetPackageExpiry(userID, expiryTime)
	if err != nil {
		logger.LogError(err, "Failed to set package expiry", map[string]interface{}{
			"layer":     "service",
			"operation": "SchedulePackageExpiration",
			"userID":    userID,
		})
		return err
	}

	logger.Log.Info().
		Int("userID", userID).
		Time("expiryTime", expiryTime).
		Msg("Package expiration scheduled")

	return nil
}

// CheckAndDowngradeExpiredPackages processes all expired premium packages
func (s *schedulerService) CheckAndDowngradeExpiredPackages() (int, error) {
	expiredUsers, err := s.authRepo.GetExpiredPremiumUsers()
	if err != nil {
		logger.LogError(err, "Failed to get expired premium users", map[string]interface{}{
			"layer":     "service",
			"operation": "CheckAndDowngradeExpiredPackages",
		})
		return 0, err
	}

	if len(expiredUsers) == 0 {
		logger.Log.Info().Msg("No expired premium packages found")
		return 0, nil
	}

	processedCount := 0
	var lastError error

	for _, userID := range expiredUsers {
		// Downgrade to free package with 2MB storage limit
		err := s.authRepo.UpgradeUserPackage(userID, "free") // 2MB = 2 * 1024 * 1024
		if err != nil {
			logger.LogError(err, "Failed to downgrade expired user", map[string]interface{}{
				"layer":     "service",
				"operation": "CheckAndDowngradeExpiredPackages",
				"userID":    userID,
			})
			lastError = err
			continue
		}

		// Clear package expiry
		err = s.authRepo.ClearPackageExpiry(userID)
		if err != nil {
			logger.LogError(err, "Failed to clear package expiry", map[string]interface{}{
				"layer":     "service",
				"operation": "CheckAndDowngradeExpiredPackages",
				"userID":    userID,
			})
			lastError = err
			// Don't continue here as the downgrade was successful
		}

		processedCount++
		logger.Log.Info().
			Int("userID", userID).
			Msg("User package downgraded due to expiration")
	}

	logger.Log.Info().
		Int("total_found", len(expiredUsers)).
		Int("processed_successfully", processedCount).
		Msg("Package expiration check completed")

	// Return error only if no users were processed successfully
	if processedCount == 0 && lastError != nil {
		return 0, lastError
	}

	return processedCount, nil
}
