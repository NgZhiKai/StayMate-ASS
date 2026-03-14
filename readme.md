# StayMate

StayMate is a microservices-based hotel booking platform with a React frontend and Spring Boot backend services.

## Repository Structure

- `frontend/hotel-booking-frontend`: React + TypeScript + Vite client app
- `backend`: Spring Boot microservices (gateway, user, hotel, booking, payment, notification, email)
- `docs`: supporting docs/assets

## Quick Start

### 1. Backend

From `backend/`:

1. Initialize MySQL using:
   - `mysql-ddl-microservices.sql`
2. Start all services:
   - `run-all.bat`

Main endpoints:
- API Gateway: `http://localhost:8080/api`

Detailed backend setup:
- [backend/readme.md](backend/readme.md)

### 2. Frontend

From `frontend/hotel-booking-frontend/`:

```bash
npm install
npm run dev
```

Frontend dev URL:
- `http://localhost:5173`

Detailed frontend setup:
- [frontend/hotel-booking-frontend/readme.md](frontend/hotel-booking-frontend/readme.md)

## Common Commands

Backend:
- Build all: `mvn clean install`
- Compile selected services: `mvn -pl user-service,hotel-service,booking-service,payment-service,notification-service,email-service,api-gateway -DskipTests compile`

Frontend:
- Lint: `npm run lint`
- Build: `npm run build`
- Preview build: `npm run preview`
