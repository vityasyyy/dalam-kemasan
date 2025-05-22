package utils

import (
	"auth-service/internal/logger"
	"auth-service/internal/metrics"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func ReqLoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		c.Next()

		duration := time.Since(start)

		logger.Log.Info().
			Str("method", c.Request.Method).
			Str("path", c.Request.URL.Path).
			Int("status", c.Writer.Status()).
			Dur("duration", duration).
			Str("ip_address", c.ClientIP()).
			Msg("Request processed")
	}
}

func PrometheusMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		status := fmt.Sprint(c.Writer.Status())
		path := c.FullPath()
		method := c.Request.Method
		duration := time.Since(start)
		metrics.HTTPReqs.WithLabelValues(method, path, status).Inc()
		metrics.HTTPDur.WithLabelValues(method, path).Observe(duration.Seconds())
	}
}
