package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func ValidateAccessTokenMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.URL.Path == "/auth/logout" {
			c.Next()
			return
		}
		// get the access token from the context cookie sent by the client
		accessToken, err := c.Cookie("access_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to get access token"})
			c.Abort()
			return
		}
		if accessToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Access token is required"})
			c.Abort()
			return
		}

		// validate the access token using the ValidateAccessToken function in the same utils package
		accessTokenClaims, err := ValidateAccessToken(accessToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid access token"})
			c.Abort()
			return
		}

		// set the user information to the context
		c.Set("user_id", accessTokenClaims.UserID)
		c.Set("email", accessTokenClaims.Email)
		c.Set("username", accessTokenClaims.Username)
		// proceed the request further
		c.Next()
	}
}
