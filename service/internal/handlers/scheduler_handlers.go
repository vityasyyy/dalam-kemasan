package handlers

import (
	"net/http"
	"service/internal/logger"
	"service/internal/services"

	"github.com/gin-gonic/gin"
)

type SchedulerHandler struct {
	schedulerService services.SchedulerService
}

func NewSchedulerHandler(schedulerService services.SchedulerService) *SchedulerHandler {
	return &SchedulerHandler{
		schedulerService: schedulerService,
	}
}

// CheckExpiredPackagesHandler handles the cron job request from dkron
func (h *SchedulerHandler) CheckExpiredPackagesHandler(c *gin.Context) {
	// Verify the request is coming from dkron (optional security measure)
	userAgent := c.GetHeader("User-Agent")
	if userAgent != "Dkron" && userAgent != "curl/7.68.0" && userAgent != "Go-http-client/1.1" && userAgent != "" {
		logger.Log.Warn().Str("user_agent", userAgent).Msg("Unauthorized scheduler request")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	logger.Log.Info().Msg("Starting package expiration check via dkron")

	count, err := h.schedulerService.CheckAndDowngradeExpiredPackages()
	if err != nil {
		logger.LogError(err, "Failed to check expired packages", map[string]interface{}{
			"layer":     "handler",
			"operation": "CheckExpiredPackagesHandler",
		})
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to process expired packages",
			"message": err.Error(),
		})
		return
	}

	logger.Log.Info().Int("processed_count", count).Msg("Package expiration check completed")

	c.JSON(http.StatusOK, gin.H{
		"status":          "success",
		"message":         "Package expiration check completed",
		"processed_count": count,
		"timestamp": gin.H{
			"unix": gin.H{
				"seconds": gin.H{
					"value": "time.Now().Unix()",
				},
			},
		},
	})
}
