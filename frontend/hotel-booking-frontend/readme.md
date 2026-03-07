# StayMate Frontend

React + TypeScript + Vite frontend for StayMate.

## Prerequisites

- Node.js 18+
- npm 9+
- Running backend API Gateway at `http://localhost:8080/api`

## Setup

From `frontend/hotel-booking-frontend`:

```bash
npm install
```

## Run

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## Environment Variables

The app uses Vite env vars (optional overrides):

- `VITE_APP_API_GATEWAY_BASE_URL` (default: `http://localhost:8080/api`)
- `VITE_APP_USER_BASE_URL`
- `VITE_APP_HOTEL_BASE_URL`
- `VITE_APP_BOOKING_BASE_URL`
- `VITE_APP_NOTIFICATION_BASE_URL`
- `VITE_APP_PAYMENT_BASE_URL`
- `VITE_APP_OPEN_CAGE_API_KEY`

If service-specific vars are not set, frontend falls back to `VITE_APP_API_GATEWAY_BASE_URL`.

## Notes

- Login and all API calls should go through gateway routes (`/api/...`).
- Backend startup instructions are in [../../backend/readme.md](../../backend/readme.md).
