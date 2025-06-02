package routes

import (
	"service/internal/handlers"
	"service/internal/utils"

	"github.com/gin-gonic/gin"
)

func InitializeRoutes(r *gin.Engine, userHandler *handlers.UserHandler, fileHandler *handlers.FileHandler, schedulerHandler *handlers.SchedulerHandler) {
	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "healthy"})
	})

	api := r.Group("/api/v1")
	{
		// Public user routes
		userRoutes := api.Group("/user")
		{
			userRoutes.POST("/register", userHandler.RegisterUserHandler)
			userRoutes.POST("/login", userHandler.LoginUserHandler)
			userRoutes.POST("/refresh", userHandler.RefreshTokenHandler)
			userRoutes.POST("/request-password-reset", userHandler.RequestPasswordResetHandler)
			userRoutes.POST("/reset-password", userHandler.ResetPasswordHandler)
		}

		// Protected routes (require authentication)
		authRoutes := api.Group("/auth")
		authRoutes.Use(utils.ValidateAccessTokenMiddleware())
		{
			// User management
			authRoutes.GET("/user/info", userHandler.ValidateUserAndGetInfoHandler)
			authRoutes.POST("/user/logout", userHandler.LogoutUserHandler)
			authRoutes.POST("/billing/upgrade", userHandler.UpgradePackageHandler)

			// File management
			fileRoutes := authRoutes.Group("/files")
			{
				fileRoutes.GET("/billing", fileHandler.GetBillingInfoHandler)
				fileRoutes.POST("/upload", fileHandler.UploadFileHandler)
				fileRoutes.GET("/list", fileHandler.ListFilesHandler)
				fileRoutes.GET("/download/:fileID", fileHandler.DownloadFileHandler)
				fileRoutes.DELETE("/delete/:fileID", fileHandler.DeleteFileHandler)
			}
		}

		// Scheduler routes (internal use only)
		schedulerRoutes := api.Group("/internal/scheduler")
		{
			schedulerRoutes.POST("/check-expired-packages", schedulerHandler.CheckExpiredPackagesHandler)
		}
	}
}
