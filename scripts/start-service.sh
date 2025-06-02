#!/bin/bash
# filepath: /Users/miapalovaara/dalam-kemasan/scripts/start-services.sh

set -e

echo "🚀 Starting Dalam Kemasan services..."

# Create network if it doesn't exist
echo "🌐 Creating Docker network..."
docker network create dalam-kemasan-network 2>/dev/null || echo "Network already exists"

# Stop and remove existing containers
echo "🛑 Stopping and removing existing containers..."
docker compose down -v --remove-orphans || echo "No existing containers to stop"
# Start services
echo "🐳 Starting Docker Compose services..."
docker compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Setup dkron jobs
echo "⚙️ Setting up Dkron jobs..."
chmod +x ./scripts/setup-dkron-jobs.sh
./scripts/setup-dkron-jobs.sh

echo "✅ All services started successfully!"
echo ""
echo "📋 Service URLs:"
echo "  🔗 API: http://localhost:8081"
echo "  📊 Grafana: http://localhost:3000 (admin/admin)"
echo "  🎯 Prometheus: http://localhost:9090"
echo "  ⏰ Dkron: http://localhost:8080"
echo "  💾 MinIO: http://localhost:9001 (minioadmin/minioadmin)"
echo ""
echo "🔍 Check logs with: docker-compose logs -f"