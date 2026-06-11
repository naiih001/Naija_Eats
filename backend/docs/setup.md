# Setup Guide

This backend runs on Bun with Express, Prisma, and PostgreSQL.

## Requirements

- Bun installed locally
- A PostgreSQL database
- EmailJS credentials (service ID, template IDs, public/private keys) for transactional emails

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
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"
PORT=3000
NODE_ENV=development
EMAILJS_SERVICE_ID="service_t4xoffb"
EMAILJS_PUBLIC_KEY="your_emailjs_public_key"
EMAILJS_PRIVATE_KEY="your_emailjs_private_key"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

Variable notes:

- `DATABASE_URL`: PostgreSQL connection string used by Prisma.
- `JWT_SECRET`: secret used to sign and verify auth tokens.
- `FRONTEND_URL`: base URL used for redirects after email verification and reset-token validation.
- `BACKEND_URL`: base URL used inside email links.
- `EMAILJS_SERVICE_ID`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY`: used by EmailJS for sending verification and password-reset emails.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: used for admin meal image uploads.

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

- `User` (with `role` field: `"user"` or `"admin"`) and `Profile`
- `budgets`
- `household_profiles`
- `user_preferences`
- `user_allergies`
- `dietary_tags`
- `meals` (with `ingredients` JSON field, `cuisine`, `image_url`)
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

- `/auth`: registration, email verification, login, resend verification, forgot password, password reset, and protected routes (get/update profile, change password)
- `/meals`: protected preference, meals, and meal-plan routes from `src/routes/meals.ts`
- `/timetable`: protected timetable generate and swap routes from `src/routes/timetable.ts`
- `/api`: protected onboarding and meal-plan routes from `src/routes/onboarding.ts`
- `/profile`: protected user profile CRUD from `src/routes/profile.ts`
- `/admin`: protected admin-only routes (meal image upload) from `src/routes/admin.ts`

## Behavioral Notes

- Email verification is required before login succeeds.
- Some route families overlap in purpose. For example, both `POST /meals/preference` and the `/api/users/preferences/*` routes write onboarding-related data.
- Some meal-plan endpoints are partial implementations today and return limited data. See [docs/api.md](/home/isaac/Documents/caya/Naija_Eats/backend/docs/api.md:1) for the exact current behavior.
