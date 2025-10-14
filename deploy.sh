#!/bin/bash

# Simple deployment script for Blend Backend
# Run this from your local machine to deploy to your app node

set -e

echo "🚀 Deploying Blend Backend to your infrastructure..."

# Make scripts executable
chmod +x scripts/*.sh

# Run the deployment script
./scripts/deploy-to-app-node.sh latest

echo "✅ Deployment completed!"
echo ""
echo "🔍 To check status:"
echo "ssh blend-app 'kubectl get pods -n blend-backend'"
echo ""
echo "🌐 To access locally:"
echo "ssh blend-app 'kubectl port-forward svc/blend-backend-service 8080:80 -n blend-backend'"
echo "Then visit: http://localhost:8080/health"
