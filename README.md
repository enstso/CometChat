# CometChat

CometChat is a real-time chat application built with **NestJS** (backend), **Vite + React** (frontend), using **GraphQL**, **Redis**, **PostgreSQL**, and **WebSocket** for live communication. The backend uses BullMQ for job queues and Prisma as ORM.

---

## Table of Contents

* [Features](#features)
* [Project Structure](#project-structure)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Running with Docker](#running-with-docker)
* [Running Locally](#running-locally)
* [Using Kubernetes](#using-kubernetes)
* [Testing](#testing)
* [Project Details](#project-details)

---

## Features

* JWT-based authentication with Auth0  
* Real-time messaging via WebSockets and BullMQ queue processing  
* User management and searching with GraphQL API  
* Conversation handling with pagination and relay-style connections  
* Health check endpoints  
* Redis for caching and job queue  
* PostgreSQL as the database, managed by Prisma ORM  
* Docker and Kubernetes manifests for containerized deployment  

---

## Project Structure

```

/back       - NestJS backend
/front      - React + Vite frontend
/docker-compose.yml - Docker Compose setup for Redis, PostgreSQL, Redis Commander, pgAdmin
/k8s       - Kubernetes manifests for deployment and services

````

---

## Prerequisites

* Docker & Docker Compose installed ([Docker docs](https://docs.docker.com/get-docker/))  
* Node.js (v18+ recommended)  
* npm or yarn package manager  
* Kubernetes cluster (for k8s deployment)  
* Access to Auth0 tenant for authentication  

---

## Installation

### 1. Clone the repo

```bash
git clone https://github.com/enstso/cometchat.git
cd cometchat
````

### 2. Start dependent services with Docker Compose

This will start Redis, Redis Commander (UI), PostgreSQL, and pgAdmin:

```bash
docker-compose up -d
```

Check the services:

* Redis at `localhost:6379`
* Redis Commander UI at `http://localhost:8081`
* PostgreSQL at `localhost:5432`
* pgAdmin at `http://localhost:5050` (default creds in `.env`)

### 3. Backend Setup (`/back`)

```bash
cd back
npm install
npx prisma generate       # generate Prisma client
npx prisma db push        # push Prisma schema to DB
```

### 4. Frontend Setup (`/front`)

```bash
cd ../front
npm install
npm run generate          # generate GraphQL types & code (if applicable)
```

---

## Environment Variables

### Backend (`back/.env`)

Create a `.env` file in `/back` with these variables:

```env
DATABASE_URL=postgresql://postgres:changeme@localhost:5432/cometChatDb
REDIS_HOST=redis
REDIS_PORT=6379
NODE_ENV=development
FRONT_URL=http://localhost:5173
AUTH0_DOMAIN=your-auth0-domain
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_AUDIENCE=your-auth0-audience
JWT_SECRET=your-jwt-secret
PORT=3000
```

### Frontend (`front/.env`)

Create a `.env` file in `/front`:

```env
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-audience
VITE_API_GRAPHQL_URL=http://localhost:3000/graphql
VITE_API_URL=http://localhost:3000
VITE_AUTH0_SCOPE="openid profile email"
NODE_ENV=development
```

---

## Running Locally

After installing dependencies and setting up `.env` files:

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

Your frontend will be available on `http://localhost:5173` and backend on `http://localhost:3000`.

---

## Running with Docker

Your `docker-compose.yml` starts Redis and PostgreSQL services.

To build and run backend and frontend in Docker (optional, uncomment their sections in your docker-compose.yml), run:

```bash
docker-compose up -d --build
```

---

## Using Kubernetes

Manifests are provided for frontend, backend deployments, services, ingress, configmaps, and secrets.

### Steps:

1. Customize all ConfigMaps and Secrets (`cometchat-back-configmap`, `cometchat-back-secret`, `cometchat-front-configmap`) with your values.
2. Deploy to your cluster:

```bash
kubectl apply -f k8s/
```

3. The ingress resource manages routing to frontend and backend services.

---

## Testing

Backend unit tests use Jest.

Run tests:

```bash
cd back
npm run test
```

---

## Project Details

* **Backend**:

  * NestJS modules separated by concern: Auth, User, Message, Conversation, Health, BullMQ queue management, Websocket gateway
  * Prisma ORM for database access
  * BullMQ for background job processing and queueing messages
  * JWT Auth guard for GraphQL API protection
  * Websocket server to manage real-time messaging and room joining

* **Frontend**:

  * React with Vite for fast development
  * GraphQL client generated from schema (codegen)
  * Uses Auth0 for authentication
  * Environment variables prefixed with `VITE_` for frontend exposure

* **Docker**:

  * Redis, PostgreSQL, Redis Commander, and pgAdmin provided in `docker-compose.yml`
  * Optional Dockerfiles for frontend and backend to containerize apps

* **Kubernetes**:

  * Deployment with multiple replicas for scalability
  * Services exposing backend and frontend
  * Ingress resource for routing
  * ConfigMaps and Secrets for environment configs

---

## Architecture Overview (Mermaid Diagram)

```mermaid
graph TD
  
 subgraph subGraph0["Frontend Pod"]
        Frontend["Frontend"]
  end
 subgraph subGraph1["Backend Pod"]
        Backend["Backend"]
  end
 subgraph subGraph2["Database Pod"]
        Postgres[("PostgreSQL")]
  end
 subgraph subGraph3["Cache Pod"]
        Redis[("Redis")]
  end
 subgraph subGraph4["Kubernetes Cluster"]
    direction TB
        subGraph0
        subGraph1
        subGraph2
        subGraph3
        Auth0[("Auth0")]
  end
    Frontend --> Backend & Auth0
    Backend --> Postgres & Redis & Auth0 & Frontend

```

---
