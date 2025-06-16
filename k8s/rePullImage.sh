#!/bin/bash

# Étape 1: Liste les images Docker
echo "Liste des images Docker existantes:"
docker image ls

# Étape 2: Supprimer les images spécifiées si elles existent
IMAGES=("enstso/cometchat-front" "enstso/cometchat-back")

for IMAGE in "${IMAGES[@]}"; do
    IMAGE_IDS=$(docker images --format "{{.Repository}}:{{.Tag}} {{.ID}}" | grep "^$IMAGE" | awk '{print $2}')
    if [ -n "$IMAGE_IDS" ]; then
        echo "Suppression de l'image: $IMAGE"
        for ID in $IMAGE_IDS; do
            docker rmi -f "$ID"
        done
    else
        echo "Image $IMAGE non trouvée, rien à supprimer."
    fi
done

# Étape 3: Pull des images à jour
echo "Récupération des dernières versions des images..."
for IMAGE in "${IMAGES[@]}"; do
    docker pull "$IMAGE"
done

echo "Opération terminée."