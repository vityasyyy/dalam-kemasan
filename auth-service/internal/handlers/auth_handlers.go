package handlers

import (
	"auth-service/internal/models"
	"auth-service/internal/services"
	"auth-service/internal/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	authService  services.AuthService
	tokenService services.RefreshTokenService
}

func NewUserHandler(authService services.AuthService, tokenService services.RefreshTokenService) *UserHandler {
	return &UserHandler{authService: authService, tokenService: tokenService}
}

func (h *UserHandler) RegisterUserHandler(c *gin.Context) {
	var userStructThatWantsToRegister models.User

	// check if the password is more than 72 characters (bcrypt limitation)
	if len(userStructThatWantsToRegister.Password) > 72 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Password maximum length is 72 characters"})
		return
	}

	// bind the json input to the user struct so that it matches the user models
	if err := c.ShouldBindJSON(&userStructThatWantsToRegister); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}

	// call the register user function from the auth service
	if err := h.authService.RegisterUser(&userStructThatWantsToRegister); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to register user", "error": err.Error()})
		return
	}

	// if the user is registered successfully, return a success message and status code 201
	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

func (h *UserHandler) LoginUserHandler(c *gin.Context) {
	// create a struct to hold the login request that will be sent by the client
	var loginRequestStruct struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	// bind the json input to the login request struct
	if err := c.ShouldBindJSON(&loginRequestStruct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}

	// call the login user function from the auth service
	accessToken, refreshToken, err := h.authService.LoginUser(loginRequestStruct.Email, loginRequestStruct.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to login", "error": err.Error()})
		return
	}

	// set the access and refresh token in the cookie
	if err := utils.SetAccessAndRefresh(c, accessToken, refreshToken); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to set cookie", "error": err.Error()})
		return
	}

	// if the login is successful, return a success message and status code 200
	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}

func (h *UserHandler) LogoutUserHandler(c *gin.Context) {
	// get the refresh token from the cookie
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to get refresh token for revoke", "error": err.Error()})
		return
	}

	// blacklist the refresh token, if it's not possible then the token is already invalid
	err = h.tokenService.BlacklistRefreshToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "You are already logged out"})
		return
	}

	// clear cookies after blacklisting the refresh token
	utils.ClearCookie(c, "access_token")
	utils.ClearCookie(c, "refresh_token")

	// return a success message and status code 200
	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}

func (h *UserHandler) RefreshTokenHandler(c *gin.Context) {
	// get the refresh token from the cookie
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Failed to retrieve cookie", "error": err.Error()})
		return
	}
	if refreshToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "No refresh token found in cookie"})
		return
	}

	// validate the refresh token and generate a new token pair from the validate refresh token function from the service layer
	newAccessToken, newRefreshToken, err := h.tokenService.ValidateRefreshToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Failed to validate refresh token", "error": err.Error()})
		return
	}

	// set the new access and refresh token in the cookie
	if err := utils.SetAccessAndRefresh(c, newAccessToken, newRefreshToken); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to set cookie after refreshing tokens", "error": err.Error()})
		return
	}

	// return a success message and status code 200
	c.JSON(http.StatusOK, gin.H{"message": "Token refreshed", "newAccessToken": newAccessToken, "newRefreshToken": newRefreshToken})
}

func (h *UserHandler) ValidateUserAndGetInfoHandler(c *gin.Context) {
	// get the user info from the context middleware
	userID, _ := c.Get("user_id")
	email, _ := c.Get("email")
	username, _ := c.Get("username")

	// return the user info and status code 200
	c.JSON(http.StatusOK, gin.H{"message": "Authorized and okay to proceed", "email": email, "user_id": userID, "username": username})
}

func (h *UserHandler) RequestPasswordResetHandler(c *gin.Context) {
	// create a struct to hold the email that will be sent by the client
	var emailStruct struct {
		Email string `json:"email" binding:"required"`
	}

	// bind the json input to the email struct
	if err := c.ShouldBindJSON(&emailStruct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}

	// call the request password reset function from the auth service
	if err := h.authService.RequestPasswordReset(emailStruct.Email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to request password reset", "error": err.Error()})
		return
	}

	// return a success message and status code 200
	c.JSON(http.StatusOK, gin.H{"message": "Password reset requested, check your spam folder if you receive nothing"})
}

func (h *UserHandler) ResetPasswordHandler(c *gin.Context) {
	// create a struct to hold the reset token and the new password that will be sent by the client
	var resetPasswordStruct struct {
		ResetToken  string `json:"reset_token" binding:"required"`
		NewPassword string `json:"new_password" binding:"required"`
	}

	// bind the json input to the reset password struct
	if err := c.ShouldBindJSON(&resetPasswordStruct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}

	// call the reset password function from the auth service
	if err := h.authService.ResetPassword(resetPasswordStruct.ResetToken, resetPasswordStruct.NewPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to reset password", "error": err.Error()})
		return
	}

	// return a success message and status code 200
	c.JSON(http.StatusOK, gin.H{"message": "Password reset successful"})
}

func (h *UserHandler) UpgradePackageHandler(c *gin.Context) {
	userID, err := getUserIDFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	type UpgradeRequest struct {
		Package string `json:"package" binding:"required"`
	}
	var req UpgradeRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body. 'package' field is required (e.g., 'premium')."})
		return
	}

	if req.Package != "free" && req.Package != "premium" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package type. Must be 'free' or 'premium'."})
		return
	}

	err = h.authService.UpgradeUserPackage(userID, req.Package)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to upgrade package: %s", err.Error())})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("User package successfully upgraded to %s", req.Package)})
}
