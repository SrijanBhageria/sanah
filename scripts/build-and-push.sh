#!/bin/bash

# Build and Push Script for Blend Backend
# This script builds the Docker image and pushes it to AWS ECR

set -e

# Configuration
ECR_REGISTRY="287030536891.dkr.ecr.ap-south-1.amazonaws.com"
ECR_REPOSITORY="blend/blend-services"
AWS_REGION="ap-south-1"
IMAGE_TAG=${1:-latest}

echo "🚀 Starting build and push process..."
echo "📦 ECR Registry: $ECR_REGISTRY"
echo "🏷️  Image Tag: $IMAGE_TAG"

# Step 1: Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Step 2: Build the Docker image
echo "🔨 Building Docker image..."
docker build -t blend-services:$IMAGE_TAG .

# Step 3: Tag the image for ECR
echo "🏷️  Tagging image for ECR..."
docker tag blend-services:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

# Step 4: Push the image to ECR
echo "📤 Pushing image to ECR..."
docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

echo "✅ Build and push completed successfully!"
echo "🖼️  Image: $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"
