#!/bin/bash

# Update Secrets Script for Blend Backend
# This script helps update the Kubernetes secrets with proper base64 encoded values

set -e

NAMESPACE="blend-backend"

echo "🔐 Updating Kubernetes secrets..."

# Function to encode and update secret
update_secret() {
    local key=$1
    local value=$2
    
    echo "🔑 Updating secret key: $key"
    
    # Encode the value
    local encoded_value=$(echo -n "$value" | base64)
    
    # Update the secret
    kubectl patch secret blend-backend-secrets -n $NAMESPACE --type='json' -p="[{\"op\": \"replace\", \"path\": \"/data/$key\", \"value\": \"$encoded_value\"}]"
}

# Get values from user
echo "📝 Please provide the following values:"

read -p "MongoDB URI (mongodb://blend_mongo:Blend@3012@10.0.2.28:27017/blend_db): " mongodb_uri
read -p "JWT Secret (your-super-secret-jwt-key-change-this-in-production): " jwt_secret

# Update secrets
update_secret "MONGODB_URI" "$mongodb_uri"
update_secret "JWT_SECRET" "$jwt_secret"

echo "✅ Secrets updated successfully!"
echo "🔍 To verify: kubectl get secret blend-backend-secrets -n $NAMESPACE -o yaml"
