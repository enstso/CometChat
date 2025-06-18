#!/bin/bash

# Step 0: Delete existing Kubernetes deployments
echo "Deleting Kubernetes deployments cometchat-back and cometchat-front..."
kubectl delete deployment cometchat-back
kubectl delete deployment cometchat-front

# Step 1: List existing Docker images
echo "Listing existing Docker images:"
docker image ls

# Step 2: Remove specified images if they exist
IMAGES=("enstso/cometchat-front" "enstso/cometchat-back")

for IMAGE in "${IMAGES[@]}"; do
    IMAGE_IDS=$(docker images --format "{{.Repository}}:{{.Tag}} {{.ID}}" | grep "^$IMAGE" | awk '{print $2}')
    if [ -n "$IMAGE_IDS" ]; then
        echo "Removing image: $IMAGE"
        for ID in $IMAGE_IDS; do
            docker rmi -f "$ID"
        done
    else
        echo "Image $IMAGE not found, nothing to remove."
    fi
done

# Step 3: Pull the latest versions of the images
echo "Pulling the latest versions of images..."
for IMAGE in "${IMAGES[@]}"; do
    docker pull "$IMAGE"
done

# Step 4: Apply Kubernetes deployment files
echo "Applying Kubernetes deployment files..."
kubectl apply -f /home/cipher/personal/CometChat/k8s/cometchat-back-deployment.yaml
kubectl apply -f /home/cipher/personal/CometChat/k8s/cometchat-front-deployment.yaml

echo "Operation completed."
