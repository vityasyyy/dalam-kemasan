package metrics

import "github.com/prometheus/client_golang/prometheus"

var (
	HTTPReqs = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Namespace: "auth_service",
			Name:      "http_requests_total",
			Help:      "Total number of HTTP requests",
		},
		[]string{"method", "path", "status"},
	)

	HTTPDur = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Namespace: "auth_service",
			Name:      "http_request_duration_seconds",
			Help:      "Duration of HTTP requests in seconds",
			Buckets:   prometheus.DefBuckets,
		},
		[]string{"method", "path"},
	)
)

func init() {
	prometheus.MustRegister(HTTPReqs)
	prometheus.MustRegister(HTTPDur)
}
