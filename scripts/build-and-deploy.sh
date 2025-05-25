#!/bin/bash

set -e

echo "🚀 Building and deploying Dalam Kemasan to Minikube..."

# Set minikube docker environment
eval $(minikube docker-env)

# Build the auth service image
echo "📦 Building auth-service image..."
docker build -t auth-service:latest ../auth-service/

# Apply Kubernetes manifests
echo "🔧 Applying Kubernetes manifests..."
kubectl apply -f ../k8s

# Wait for database to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n dalam-kemasan --timeout=300s

# Deploy auth service
kubectl apply -f ../k8s/auth-service.yaml

# Wait for auth service to be ready
echo "⏳ Waiting for auth-service to be ready..."
kubectl wait --for=condition=ready pod -l app=auth-service -n dalam-kemasan --timeout=300s

# Deploy monitoring stack
kubectl apply -f ../k8s/monitoring.yaml

echo "✅ Deployment complete!"
echo ""
echo "📋 Access services via NodePort:"
echo "   Auth Service: http://$(minikube ip):30081"
echo "   Grafana: http://$(minikube ip):30300 (admin/admin)"
echo "   MinIO Console: http://$(minikube ip):30901 (minioadmin/minioadmin123)"
echo "   Prometheus: http://$(minikube ip):30909"
echo ""
echo "🔧 Or start minikube tunnel for LoadBalancer access:"
echo "   minikube tunnel"
