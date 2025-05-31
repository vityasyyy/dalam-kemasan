#!/bin/bash
# filepath: /Users/miapalovaara/dalam-kemasan/scripts/setup-dkron-jobs.sh

# Wait for dkron to be ready
echo "🔄 Waiting for Dkron to be ready..."
until curl -f http://localhost:8080/health > /dev/null 2>&1; do
    echo "⏳ Dkron not ready yet, waiting 5 seconds..."
    sleep 5
done

echo "✅ Dkron is ready! Setting up jobs..."

# Create the package expiration check job
JOB_RESPONSE=$(curl -s -X POST http://localhost:8080/v1/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "check-expired-packages",
    "schedule": "@every 1m",
    "executor": "http",
    "executor_config": {
      "method": "POST",
      "url": "http://service-api:8081/api/v1/internal/scheduler/check-expired-packages",
      "headers": "Content-Type:application/json,User-Agent:Dkron",
      "timeout": "30s",
      "expectCode": "200"
    },
    "retries": 2,
    "disabled": false,
    "tags": {
      "environment": "development",
      "service": "dalam-kemasan"
    }
  }')

echo "📋 Job Response: $JOB_RESPONSE"

# Verify the job was created
echo "🔍 Verifying job creation..."
JOBS_LIST=$(curl -s http://localhost:8080/v1/jobs)
echo "📊 Current jobs: $JOBS_LIST"

echo "✅ Dkron job 'check-expired-packages' created successfully!"
echo "📋 Job will run every 2 minutes to check for expired premium packages"
echo "🌐 You can monitor jobs at: http://localhost:8080"
echo "📊 API endpoint: http://localhost:8081/api/v1/internal/scheduler/check-expired-packages"