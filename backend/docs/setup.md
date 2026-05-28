# Setup Guide

This backend runs on Bun with Express, Prisma, and PostgreSQL.

## Requirements

- Bun installed locally
- A PostgreSQL database
- A Resend API key for email delivery in auth flows

## Installation

From the backend directory:

```bash
bun install
```

Create a local environment file:

```bash
cp .env.example .env
```

Set these variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/naija_eats"
JWT_SECRET="your-secure-jwt-secret"
RESEND_API_KEY="re_your_api_key"
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"
PORT=3000
NODE_ENV=development
```

Variable notes:

- `DATABASE_URL`: PostgreSQL connection string used by Prisma.
- `JWT_SECRET`: secret used to sign and verify auth tokens.
- `RESEND_API_KEY`: required for registration verification and password-reset emails.
- `FRONTEND_URL`: base URL used for redirects after email verification and reset-token validation.
- `BACKEND_URL`: base URL used inside email links.

## Database Setup

Run migrations:

```bash
bun x prisma migrate dev
```

Generate the Prisma client if needed:

```bash
bun x prisma generate
```

The data model in [prisma/schema.prisma](/home/isaac/Documents/caya/Naija_Eats/backend/prisma/schema.prisma:1) includes:

- `User` and `Profile`
- `budgets`
- `household_profiles`
- `user_preferences`
- `user_allergies`
- `dietary_tags`
- `meals`
- `meal_plans`
- `meal_plan_items`
- `shopping_list_items`

## Running The Server

Development:

```bash
bun run dev
```

Production-style local run:

```bash
bun run start
```

Health check:

```bash
curl http://localhost:3000/health
```

## Authentication Flow

1. Register with `POST /auth/register`.
2. Open the email verification link sent by the backend.
3. Log in with `POST /auth/login` after verification.
4. Use the returned JWT in the `Authorization` header for protected routes.

Example header:

```http
Authorization: Bearer <jwt_token>
```

## Route Groups

- `/auth`: registration, email verification, login, resend verification, forgot password, password reset
- `/`: protected preference, meals, and meal-plan routes from `src/routes/meals.ts`
- `/api`: protected onboarding and alternate meal-plan routes from `src/routes/onboarding.ts`

## Behavioral Notes

- Email verification is required before login succeeds.
- Some route families overlap in purpose. For example, both `POST /preference` and the `/api/users/preferences/*` routes write onboarding-related data.
- Some meal-plan endpoints are partial implementations today and return limited data. See [docs/api.md](/home/isaac/Documents/caya/Naija_Eats/backend/docs/api.md:1) for the exact current behavior.
