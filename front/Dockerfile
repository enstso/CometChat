FROM node:22-slim AS builder

# D�finition du r�pertoire de travail
WORKDIR /app

# Copie des fichiers n�cessaires
COPY package.json package-lock.json ./

RUN npm install dotenv --save

# Installation des d�pendances
RUN npm install --frozen-lockfile

# Copie du reste de l'application
COPY . .

# Construction de l'application
RUN npm run build

# �tape finale : serveur Nginx
FROM nginx:alpine

# Suppression des fichiers par d�faut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie des fichiers g�n�r�s par Vite vers Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie de la configuration personnalis�e de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition du port 5173
EXPOSE 5173

# Lancement de Nginx
CMD ["nginx", "-g", "daemon off;"]