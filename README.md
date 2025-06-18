# CometChat

CometChat is a real-time chat application built with **NestJS** (backend) and **Vite + React** (frontend), using **GraphQL**, **Redis**, **PostgreSQL**, and **WebSocket** for live communication. It leverages **BullMQ** for background processing and **Prisma** as ORM. Authentication is handled externally via **Auth0**.

---

## Table of Contents

- [Features](#features)
- [Auth0 Integration](#auth0-integration)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Running with Docker](#running-with-docker)
- [Using Kubernetes](#using-kubernetes)
- [Testing](#testing)
- [Project Details](#project-details)
- [CI/CD](#github-actions-cicd)
- [Architecture Overview](#architecture-overview)

---

## Features

- Authentication via Auth0 (SPA & M2M applications)
- Real-time messaging with WebSockets and BullMQ
- GraphQL API for user, message, and conversation management
- Pagination with Relay-style connections
- Health check endpoints
- Redis for caching and queuing
- PostgreSQL with Prisma ORM
- Containerized with Docker & Kubernetes manifests

---

## Auth0 Integration

Authentication is fully managed by [Auth0](https://auth0.com/). You must configure **two applications** in your Auth0 tenant:

1. **Single Page Application (SPA)**  
   - Used by the frontend (React) to authenticate users.
   - Configure callback URLs, logout URLs, and allowed web origins (e.g., `http://localhost:5173`).

2. **Machine-to-Machine (M2M)**  
   - Used by the backend to securely call Auth0's Management API (e.g., token introspection).
   - Authorize it to access the Management API with scopes like `read:users`.

Ensure you update the required `.env` variables in both frontend and backend.

---

## Project Structure

```

cometchat
│
├── /back                     # Backend application (NestJS)
│   ├── /modules              # Feature-based modules folder
│   │   ├── /src              # Source code for each backend module
│   │   │   ├── /user         # User management (resolvers, services)
│   │   │   ├── /health       # Health check endpoints
│   │   │   ├── /auth         # Authentication logic (Auth0, JWT)
│   │   │   ├── /bullmq       # BullMQ queues and background jobs
│   │   │   ├── /message      # Messaging GraphQL resolvers and services
│   │   │   ├── /conversation # Conversation logic and pagination
│   │   │   ├── /prisma       # Prisma client setup and database access
│   │   │   ├── /graphql      # GraphQL schema, types and helpers
│   │   │   ├── /websocket    # WebSocket gateway and real-time logic
│   │   ├── app.controller.ts # Main app controller
│   │   ├── app.module.ts     # Main app module where modules are imported
│   │   ├── app.resolver.ts   # Root GraphQL resolver
│   │   ├── app.service.ts    # Core service layer
│   │   ├── main.ts           # Application entry point
│   │   ├── schema.gql        # GraphQL schema definition
│   │   └── /test             # Backend tests
│   ├── prisma                # Prisma schema and migrations
│   ├── Dockerfile            # Dockerfile to containerize backend
│   ├── .env.example          # Example environment variables for backend
│   ├── package.json          # Backend dependencies and scripts
│   └── README.md             # Backend-specific documentation
├── /front                    # Frontend application (React + Vite)
│   ├── /src                  # React source code
│   │   ├── assets            # Images, fonts, and other static assets
│   │   ├── components        # React components
│   │   ├── gql               # GraphQL queries, mutations, fragments
│   │   ├── services          # API service calls, auth logic, utils
│   │   ├── types             # TypeScript types/interfaces
│   │   ├── utils             # Utility functions/helpers
│   │   ├── views             # Page-level components or views
│   ├── /public               # Public static files (served directly)
│   ├── Dockerfile            # Dockerfile to containerize frontend
│   ├── nginx.conf            # Nginx config to serve built frontend
│   ├── .env.example          # Example environment variables for frontend
│   ├── package.json          # Frontend dependencies and scripts
│   └── README.md             # Frontend-specific documentation
├── docker-compose.yml        # Docker Compose config to run dependencies locally
├── /k8s                      # Kubernetes manifests for deployment and services
└── README.md                 # Root project README with overview and setup instructions



````

---

## Prerequisites

- Docker & Docker Compose
- Node.js v22+
- npm or yarn
- Kubernetes cluster
- Access to an Auth0 tenant

---

## Environment Variables

### Backend (`back/.env`)

```env
DATABASE_URL="postgresql://postgres:changeme@localhost:5432/cometChatDb?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
NODE_ENV=development

AUTH0_DOMAIN=
AUTH0_CLIENT_ID=                    # SPA App Client ID
AUTH0_AUDIENCE=                    # API identifier
AUTH0_CLIENT_SECRET=               # SPA App Client Secret (optional)
AUTH0_M_TO_M_CLIENT_ID=            # M2M App Client ID
AUTH0_M_TO_M_CLIENT_SECRET=        # M2M App Client Secret
````

### Frontend (`front/.env`)

```env
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-spa-client-id
VITE_AUTH0_AUDIENCE=your-api-audience
VITE_AUTH0_SCOPE="openid profile email"
VITE_API_GRAPHQL_URL=http://localhost:3000/graphql
VITE_API_URL=http://localhost:3000
NODE_ENV=development
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/enstso/cometchat.git
cd cometchat
```

### 2. Start services with Docker Compose

```bash
docker-compose up -d
```

Check:

* Redis: `localhost:6379`
* Redis Commander: `http://localhost:8081`
* Postgres: `localhost:5432`
* pgAdmin: `http://localhost:5050`

### 3. Backend Setup

```bash
cd back
npm install
npx prisma generate
npx prisma db push
```

### 4. Frontend Setup

```bash
cd ../front
npm install
npm run generate
```

---

## Running Locally

### Backend

```bash
cd back
npm run start:dev
```

### Frontend

```bash
cd front
npm run dev
```

Access the app at:

* Frontend: `http://localhost:5173`
* Backend: `http://localhost:3000`

---

## Running with Docker

To run frontend and backend in containers:

```bash
docker-compose up --build
```

This runs Postgres, Redis, backend, frontend, Redis Commander, and pgAdmin.

---

## Using Kubernetes

### Steps:

1. Update the following manifests with your actual secrets and config:

   * `cometchat-back-configmap`, `cometchat-back-secret`
   * `cometchat-front-configmap`

2. Apply manifests:

```bash
kubectl apply -f k8s/
```

3. Ingress handles routing to services.

---

## Testing

Run unit tests for the backend:

```bash
cd back
npm run test
```

---

## Project Details

### Backend (NestJS)

* Modular architecture
* JWT validation via Auth0
* WebSocket gateway for messaging
* Prisma ORM
* BullMQ for background tasks
* GraphQL resolvers (users, messages, conversations)

### Frontend (React + Vite)

* GraphQL codegen for typed queries
* Auth0 SDK for authentication
* Custom hooks and service layer
* Modern UI structure (components, views, utils)

### Docker & Kubernetes

* Pre-configured Dockerfiles for backend & frontend
* `docker-compose.yml` for local dev
* Kubernetes manifests: deployments, services, ingress, secrets

---

## GitHub Actions CI/CD

Automates the entire pipeline:

### Workflow: `.github/workflows/deploy.yml`

#### 1. Test Job

* Runs backend tests with Jest

#### 2. Build & Push

* Builds backend & frontend Docker images
* Pushes to Docker Hub (SHA + `latest` tags)

#### 3. Deploy (main branch only)

* SSH to remote host
* Pulls new images and restarts K8s deployments

### Required Secrets

| Secret Name       | Description                                 |
| ----------------- | ------------------------------------------- |
| `DOCKERUSERNAME`  | Docker Hub username                         |
| `DOCKERPASSWORD`  | Docker Hub password or token                |
| `SSH_PRIVATE_KEY` | SSH private key to connect to remote server |
| `REMOTE_HOST`     | SSH address of the Kubernetes host          |

---

## Architecture Overview (Mermaid Diagram)

```mermaid
graph TD

subgraph Frontend_Pod
  FE[Frontend - React]
end

subgraph Backend_Pod
  BE[Backend - NestJS]
end

subgraph Auth0_Cloud
  Auth0SPA[Auth0 - SPA App]
  Auth0M2M[Auth0 - M2M App]
end

subgraph Database_Pod
  DB[(PostgreSQL)]
end

subgraph Cache_Pod
  Cache[(Redis)]
end

FE --> BE
FE --> Auth0SPA
BE --> Auth0SPA
BE --> Auth0M2M
BE --> DB
BE --> Cache

```

---

## 🛠 repullimage.sh

Script to automate Docker image refresh in production:

* Removes old backend/frontend images
* Pulls latest ones from Docker Hub

Usage:

```bash
./repullimage.sh
```

---

## ✅ Summary

| Stage            | Description                                    |
| ---------------- | ---------------------------------------------- |
| `test`           | Runs Jest tests for backend                    |
| `build-and-push` | Builds Docker images and pushes to Docker Hub  |
| `deploy`         | SSHs to remote server and restarts deployments |

