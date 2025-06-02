package services

import (
	"errors"
	"os"
	"service/internal/logger"
	"service/internal/models"
	"service/internal/repositories"
	"service/internal/utils"
	"time"

	"golang.org/x/sync/errgroup"
)

type AuthService interface {
	RegisterUser(user *models.User) error
	LoginUser(email, password string) (string, string, error)
	RequestPasswordReset(email string) error
	ResetPassword(resetToken, newPassword string) error
	UpgradeUserPackage(userID int, newPackage string) error
	SetSchedulerService(scheduler SchedulerService)
}

type authService struct {
	authRepo         repositories.AuthRepo
	tokenService     RefreshTokenService
	schedulerService SchedulerService
}

func NewAuthService(authRepo repositories.AuthRepo, tokenService RefreshTokenService) AuthService {
	return &authService{authRepo: authRepo, tokenService: tokenService}
}

func (s *authService) SetSchedulerService(scheduler SchedulerService) {
	s.schedulerService = scheduler
}

func (s *authService) RegisterUser(userFromHandlers *models.User) error {
	// check if a user with that email exists, returns nil if no user is found and okay to proceed
	existingUser, _ := s.authRepo.GetUserByEmail(userFromHandlers.Email)

	if existingUser != nil {
		logger.LogError(errors.New("user exists"), "User exists", map[string]interface{}{"layer": "service", "operation": "RegisterUser"})
		return errors.New("user with that email already exists")
	}

	// hash the password before storing it in the database
	hashedPassword, err := utils.HashPassword(userFromHandlers.Password)
	if err != nil {
		logger.LogError(err, "Failed to hash password", map[string]interface{}{"layer": "service", "operation": "RegisterUser"})
		return err
	}
	// set the user struct that is passed by the handlers password to the hashed password
	userFromHandlers.Password = hashedPassword

	// Set default package to free if not provided
	if userFromHandlers.Package == "" {
		userFromHandlers.Package = "free"
	}

	// call the repo and create the user using the repo function, if the error is nil then log the error
	if err := s.authRepo.CreateUser(userFromHandlers); err != nil {
		logger.LogError(err, "Failed to create user", map[string]interface{}{"layer": "service", "operation": "RegisterUser"})
		return err
	}

	return nil
}

func (s *authService) LoginUser(email, password string) (string, string, error) {
	// get the user that wants to login using the email that is passed from handler
	userThatWantsToLogin, err := s.authRepo.GetUserByEmail(email)
	if err != nil {
		logger.LogError(err, "Failed to login", map[string]interface{}{"layer": "service", "operation": "LoginUser"})
		return "", "", errors.New("invalid email or password")
	}

	// check the password that the user entered with the password in the database (check hash)
	if !utils.CheckPasswordHash(password, userThatWantsToLogin.Password) {
		logger.LogError(err, "Failed to login", map[string]interface{}{"layer": "service", "operation": "LoginUser"})
		return "", "", errors.New("invalid email or password")
	}

	accessToken, refreshToken, err := s.tokenService.GenerateAccessRefreshTokenPair(userThatWantsToLogin.UserID)
	if err != nil {
		logger.LogError(err, "Failed to generate access and refresh token", map[string]interface{}{"layer": "service", "operation": "LoginUser"})
		return "", "", errors.New("failed to generate access and refresh token")
	}

	return accessToken, refreshToken, nil
}

func (s *authService) RequestPasswordReset(email string) error {
	// create a new errgroup to run multiple goroutines concurrently
	var g errgroup.Group
	user, err := s.authRepo.GetUserByEmail(email)
	if err != nil {
		logger.LogError(err, "Failed to get user by email", map[string]interface{}{"layer": "service", "operation": "RequestPasswordReset"})
		return errors.New("failed to get user by email")
	}
	if user == nil {
		logger.LogError(err, "User not found", map[string]interface{}{"layer": "service", "operation": "RequestPasswordReset"})
		return errors.New("user not found")
	}
	// create the reset token and expirtion time using the utils
	resetToken, resetTokenExpiredAt, err := utils.CreateResetToken()
	if err != nil {
		logger.LogError(err, "Failed to generate reset tokens", map[string]interface{}{"layer": "service", "operation": "RequestPasswordReset"})
		return errors.New("failed to generate reset tokens")
	}
	// generate resetLink using resetToken
	var resetLink string
	if os.Getenv("ENVIRONMENT") == "production" {
		resetLink = "https://tryout.omahti.web.id/forgot-password/" + resetToken
	} else {
		resetLink = "http://localhost:3000/forgot-password/" + resetToken
	}

	// run the goroutines concurrently
	// blacklist the token that is associated with the email, so that when user is requesting password reset, the token is blacklisted
	g.Go(func() error {
		if err := s.tokenService.BlacklistTokenOnEmail(email); err != nil {
			logger.LogError(err, "Failed to blacklist token on email", map[string]interface{}{"layer": "service", "operation": "RequestPasswordReset"})
			return errors.New("failed to blacklist token on email")
		}
		return nil
	})

	// call the repo and store the reset token in the database
	g.Go(func() error {
		if err := s.authRepo.RequestingPasswordReset(email, resetToken, resetTokenExpiredAt); err != nil {
			logger.LogError(err, "Failed to request password reset", map[string]interface{}{"layer": "service", "operation": "RequestPasswordReset"})
			return errors.New("failed to request password reset")
		}
		return nil
	})

	// email the user the reset link, using the email utils
	g.Go(func() error {
		if err := utils.SendPasswordResetEmail(email, resetLink); err != nil {
			logger.LogError(err, "Failed to send password reset email", map[string]interface{}{"layer": "service", "operation": "RequestPasswordReset"})
			return errors.New("failed to send password reset email")
		}
		return nil
	})
	// wait for the goroutines to finish, if there is an error return the error, if not return nil
	if err := g.Wait(); err != nil {
		return err
	}

	return nil
}

func (s *authService) ResetPassword(resetToken, newPassword string) error {
	newHashedPassword, err := utils.HashPassword(newPassword)
	if err != nil {
		logger.LogError(err, "Failed to hash password", map[string]interface{}{"layer": "service", "operation": "ResetPassword"})
		return errors.New("failed to hash password")
	}

	// call the repo and reset the password using the reset token and the new password
	err = s.authRepo.ResetPassword(newHashedPassword, resetToken)
	if err != nil {
		logger.LogError(err, "Failed to reset password", map[string]interface{}{"layer": "service", "operation": "ResetPassword"})
		return errors.New("failed to reset password")
	}

	return nil
}

func (s *authService) UpgradeUserPackage(userID int, newPackage string) error {
	if newPackage != "free" && newPackage != "premium" {
		return errors.New("invalid package type")
	}

	err := s.authRepo.UpgradeUserPackage(userID, newPackage)
	if err != nil {
		logger.LogError(err, "Failed to upgrade user package in service", map[string]interface{}{"layer": "service", "operation": "UpgradeUserPackage", "userID": userID, "newPackage": newPackage})
		return err
	}

	// If upgrading to premium, schedule expiration after 2 minutes
	if newPackage == "premium" && s.schedulerService != nil {
		err = s.schedulerService.SchedulePackageExpiration(userID, 2*time.Minute)
		if err != nil {
			logger.LogError(err, "Failed to schedule package expiration", map[string]interface{}{"layer": "service", "operation": "UpgradeUserPackage", "userID": userID})
			// Don't return error here as the upgrade was successful
		}
	}

	logger.LogDebug("User package upgraded in service", map[string]interface{}{"layer": "service", "operation": "UpgradeUserPackage", "userID": userID, "newPackage": newPackage})
	return nil
}
