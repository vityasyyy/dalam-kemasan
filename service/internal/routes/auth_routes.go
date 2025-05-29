package routes

import (
	"service/internal/handlers"
	"service/internal/utils"

	"github.com/gin-gonic/gin"
)

func InitializeRoutes(r *gin.Engine, userHandler *handlers.UserHandler, fileHandler *handlers.FileHandler) { // Added fileHandler
	ping := r.Group("/ping")
	{
		ping.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})
	}

	api := r.Group("/api/v1")
	{
		// public routes
		public := api.Group("/user")
		{
			public.GET("/refresh", userHandler.RefreshTokenHandler)
			public.POST("/register", userHandler.RegisterUserHandler)
			public.POST("/login", userHandler.LoginUserHandler)
			public.POST("/reset-password", userHandler.ResetPasswordHandler)
			public.POST("/request-password-reset", userHandler.RequestPasswordResetHandler)
		}

		// authorized routes for access token validation
		authorized := api.Group("/auth")
		authorized.Use(utils.ValidateAccessTokenMiddleware())
		{
			authorized.GET("/validateprofile", userHandler.ValidateUserAndGetInfoHandler)
			authorized.POST("/logout", userHandler.LogoutUserHandler)

			// File management routes
			fileRoutes := authorized.Group("/files")
			{
				fileRoutes.POST("/upload", fileHandler.UploadFileHandler)
				fileRoutes.GET("/download/:fileID", fileHandler.DownloadFileHandler)
				fileRoutes.DELETE("/:fileID", fileHandler.DeleteFileHandler)
				fileRoutes.GET("/list", fileHandler.ListFilesHandler) // Route to list user's files
			}

			// Billing route
			billingRoutes := authorized.Group("/billing")
			{
				billingRoutes.GET("/", fileHandler.GetBillingInfoHandler)
				billingRoutes.POST("/upgrade", userHandler.UpgradePackageHandler)
			}
		}
	}
}
