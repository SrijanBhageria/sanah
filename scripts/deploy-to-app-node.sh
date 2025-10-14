#!/bin/bash

# Deploy to App Node Script
# This script copies files to your app node and deploys the application

set -e

# Configuration
APP_NODE="blend-app"
LOCAL_PROJECT_PATH="/Users/kanwaradityasingh/Documents/Freelance/sanah"
REMOTE_PATH="/home/ubuntu/blend-backend"
IMAGE_TAG=${1:-latest}

echo "🚀 Starting deployment to app node..."
echo "📦 App Node: $APP_NODE"
echo "🏷️  Image Tag: $IMAGE_TAG"

# Step 1: Copy project files to app node
echo "📁 Copying project files to app node..."
ssh $APP_NODE "mkdir -p $REMOTE_PATH"
scp -r $LOCAL_PROJECT_PATH/* $APP_NODE:$REMOTE_PATH/

# Step 2: SSH into app node and build/push
echo "🔨 Building and pushing Docker image..."
ssh $APP_NODE << EOF
cd $REMOTE_PATH

# Login to ECR (already configured on your app node)
aws ecr get-login-password --region ap-south-1 | sudo docker login --username AWS --password-stdin 287030536891.dkr.ecr.ap-south-1.amazonaws.com

# Build the Docker image
echo "Building Docker image..."
sudo docker build -t blend-services:$IMAGE_TAG .

# Tag the image for ECR
echo "Tagging image for ECR..."
sudo docker tag blend-services:$IMAGE_TAG 287030536891.dkr.ecr.ap-south-1.amazonaws.com/blend/blend-services:$IMAGE_TAG

# Push the image to ECR
echo "Pushing image to ECR..."
sudo docker push 287030536891.dkr.ecr.ap-south-1.amazonaws.com/blend/blend-services:$IMAGE_TAG

echo "✅ Image built and pushed successfully!"
EOF

# Step 3: Deploy to K3s
echo "🚀 Deploying to K3s cluster..."
ssh $APP_NODE << EOF
cd $REMOTE_PATH

# Fix K3s permissions
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
sudo chown ubuntu:ubuntu /etc/rancher/k3s/k3s.yaml

# Create namespace if it doesn't exist
kubectl create namespace blend-backend --dry-run=client -o yaml | kubectl apply -f -

# Apply all Kubernetes manifests
echo "Applying Kubernetes manifests..."
kubectl apply -f k8s/

# Update deployment with new image tag
kubectl set image deployment/blend-backend blend-backend=287030536891.dkr.ecr.ap-south-1.amazonaws.com/blend/blend-services:$IMAGE_TAG -n blend-backend

# Wait for deployment to be ready
echo "Waiting for deployment to be ready..."
kubectl rollout status deployment/blend-backend -n blend-backend --timeout=300s

# Check status
echo "Checking deployment status..."
kubectl get pods -n blend-backend
kubectl get svc -n blend-backend
kubectl get ingress -n blend-backend

echo "✅ Deployment completed successfully!"
EOF

echo "🎉 Deployment to app node completed!"
echo "🔍 To check logs: ssh $APP_NODE 'kubectl logs -f deployment/blend-backend -n blend-backend'"
echo "🌐 To access: ssh $APP_NODE 'kubectl port-forward svc/blend-backend-service 8080:80 -n blend-backend'"
