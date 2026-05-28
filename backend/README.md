# Naija Eats Backend

Backend API for Naija Eats, built with Bun, Express, TypeScript, Prisma, and PostgreSQL.

## What It Does

- Registers users with hashed passwords.
- Requires email verification before login.
- Issues JWT bearer tokens for protected routes.
- Stores onboarding preferences, budget details, household profile data, dietary preferences, allergies, and dietary tags.
- Exposes meal catalogue and meal-plan endpoints for authenticated users.
- Sends verification and password-reset emails through Resend.

## Stack

- Bun
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT authentication
- Resend for transactional email

## Quick Start

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Required environment variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/naija_eats"
JWT_SECRET="your-secure-jwt-secret"
RESEND_API_KEY="re_your_api_key"
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"
PORT=3000
NODE_ENV=development
```

### 3. Run migrations

```bash
bun x prisma migrate dev
```

### 4. Start the server

```bash
bun run dev
```

The API listens on `PORT`, defaulting to `3000`.

## Available Scripts

- `bun run dev`: start the API with file watching.
- `bun run start`: start the API once.
- `./thorough_test.sh`: run the local curl-based test script if your environment has the required tools.

## Route Overview

Public routes:

- `GET /health`
- `POST /auth/register`
- `GET /auth/verify-email`
- `POST /auth/login`
- `POST /auth/resend-verification`
- `POST /auth/forgot-password`
- `GET /auth/reset-password`
- `POST /auth/reset-password`

Protected routes:

- `POST /preference`
- `GET /meals`
- `POST /meals-plan/generate`
- `GET /meals-plan/:id`
- `POST /api/users/preferences/budget`
- `POST /api/users/preferences/frequency`
- `POST /api/users/preferences/food`
- `POST /api/meal-plans/generate`
- `GET /api/meal-plans/current`
- `GET /api/meal-plans/current/details`

## Important Notes

- `POST /auth/register` creates the user and sends a verification email, but does not return a JWT.
- `GET /auth/verify-email` and `GET /auth/reset-password` redirect to the frontend instead of returning JSON.
- `POST /meals-plan/generate` accepts an `items` array, but the current implementation only creates the parent meal plan record.
- `GET /api/meal-plans/current` currently returns hard-coded `budgetStats` when an active plan exists.
- `GET /api/meal-plans/current/details` currently returns an empty object.

## Documentation

- [Setup guide](docs/setup.md)
- [API reference](docs/api.md)
- [API examples](docs/api_examples.md)

## Project Structure

```text
docs/
  api.md
  api_examples.md
  setup.md
prisma/
  schema.prisma
  migrations/
src/
  app.ts
  server.ts
  config/
  middleware/
  routes/
  utils/
```
