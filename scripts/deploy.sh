#!/bin/bash

# Deploy Script for Blend Backend
# This script deploys the application to K3s cluster

set -e

# Configuration
NAMESPACE="blend-backend"
IMAGE_TAG=${1:-latest}

echo "🚀 Starting deployment process..."
echo "📦 Namespace: $NAMESPACE"
echo "🏷️  Image Tag: $IMAGE_TAG"

# Step 1: Create namespace if it doesn't exist
echo "📁 Creating namespace..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Step 2: Update image tag in deployment
echo "🔄 Updating deployment with new image tag..."
kubectl set image deployment/blend-backend blend-backend=287030536891.dkr.ecr.ap-south-1.amazonaws.com/blend/blend-services:$IMAGE_TAG -n $NAMESPACE

# Step 3: Apply all Kubernetes manifests
echo "📋 Applying Kubernetes manifests..."
kubectl apply -f k8s/

# Step 4: Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl rollout status deployment/blend-backend -n $NAMESPACE --timeout=300s

# Step 5: Check pod status
echo "🔍 Checking pod status..."
kubectl get pods -n $NAMESPACE

# Step 6: Check service status
echo "🌐 Checking service status..."
kubectl get svc -n $NAMESPACE

# Step 7: Check ingress status
echo "🔗 Checking ingress status..."
kubectl get ingress -n $NAMESPACE

echo "✅ Deployment completed successfully!"
echo "🔍 To check logs: kubectl logs -f deployment/blend-backend -n $NAMESPACE"
echo "🌐 To port forward: kubectl port-forward svc/blend-backend-service 8080:80 -n $NAMESPACE"
