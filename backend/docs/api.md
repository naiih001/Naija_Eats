# API Reference

The Express app is defined in [src/app.ts](/home/isaac/Documents/caya/Naija_Eats/backend/src/app.ts:1).

## Base URL

Local development defaults to:

```text
http://localhost:3000
```

## Response Shape

Most JSON endpoints use the shared helper in [src/utils/helper.ts](/home/isaac/Documents/caya/Naija_Eats/backend/src/utils/helper.ts:1).

Success:

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Authentication

Protected routes require:

```http
Authorization: Bearer <jwt_token>
```

JWTs are validated by [src/middleware/auth.ts](/home/isaac/Documents/caya/Naija_Eats/backend/src/middleware/auth.ts:1). On success, `req.user` contains:

```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "phone_number": "+2348000000000"
}
```

## Public Routes

### `GET /health`

Checks server health.

Response:

```json
{
  "status": "OK",
  "message": "Server is healthy"
}
```

### `POST /auth/register`

Registers a new user, hashes their password, and creates a profile. Sends a verification email.

Request body:

```json
{
  "full_name": "Example User",
  "email": "user@example.com",
  "phone_number": "+2348000000000",
  "password": "password123"
}
```

---

### `POST /auth/login`

Logs in an existing user and returns a JWT. Requires verified email.

Request body:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

---

### `POST /auth/resend-verification`

Resends the verification email if the user is not yet verified.

Request body:

```json
{
  "email": "user@example.com"
}
```

---

### `GET /auth/verify-email/:token`

Verifies a user's email address using the token from the verification email. Redirects to the frontend with status.

---

### `POST /auth/verify-email/:token`

Alternative endpoint to verify email via POST (returns JSON response).

---

### `POST /auth/forgot-password`

Initiates the forgot password flow. Sends a password reset link to the user's email if the account exists.

Request body:

```json
{
  "email": "user@example.com"
}
```

---

### `POST /auth/reset-password`

Resets the user's password using a valid reset token (from the email link).

Request body:

```json
{
  "token": "reset-token-from-email",
  "newPassword": "new-password"
}
```

  "email": "user@example.com",
  "phone_number": "+2348000000000",
  "password": "password"
}
```

Success response:

```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com"
    }
  }
}
```

Error responses:

- `400` if any required field is missing.
- `500` on server or database failure.

### `GET /auth/verify-email`

Verifies a user's email using the `token` query parameter. This route redirects to the frontend instead of returning JSON.

Query parameters:

- `token`

Behavior:

- On success: redirects to `${FRONTEND_URL}/sign-in?status=success&message=Email%20verified%20successfully&verified=true`
- On invalid or expired token: redirects to `${FRONTEND_URL}/sign-in?status=error&message=Invalid%20or%20expired%20verification%20token&verified=false`
- On missing token: redirects to `${FRONTEND_URL}/sign-in?status=error&message=Token%20is%20required&verified=false`

### `POST /auth/login`

Authenticates a verified user and returns a JWT valid for 24 hours.

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Success response:

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "token": "jwt-token"
  }
}
```

Error responses:

- `401` for invalid credentials.
- `403` if the email is not yet verified.
- `500` on server failure.

### `POST /auth/resend-verification`

Generates a fresh email verification token and sends another verification email.

Request body:

```json
{
  "email": "user@example.com"
}
```

Success response:

```json
{
  "success": true,
  "message": "Verification email resent successfully."
}
```

Error responses:

- `400` if `email` is missing.
- `400` if the user is already verified.
- `404` if no user exists for the email.
- `500` on server failure.

### `POST /auth/forgot-password`

Generates a password reset token and sends a reset email. To avoid email enumeration, this returns the same success message whether or not the email exists.

Request body:

```json
{
  "email": "user@example.com"
}
```

Success response:

```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

Error responses:

- `400` if `email` is missing.
- `500` on server failure.

### `GET /auth/reset-password`

Validates a password-reset token and redirects to the frontend instead of returning JSON.

Query parameters:

- `token`

Behavior:

- On success: redirects to `${FRONTEND_URL}/reset-password?token=<token>&status=success&message=Set%20new%20password`
- On invalid or expired token: redirects to `${FRONTEND_URL}/forgot-password?status=error&message=Invalid%20or%20expired%20reset%20token`
- On missing token: redirects to `${FRONTEND_URL}/forgot-password?status=error&message=Token%20is%20required`

### `POST /auth/reset-password`

Consumes a password reset token and stores a new password hash.

Request body:

```json
{
  "token": "reset-token",
  "newPassword": "new-password123"
}
```

Success response:

```json
{
  "success": true,
  "message": "Password reset successfully. You can now log in with your new password."
}
```

Error responses:

- `400` if `token` or `newPassword` is missing.
- `400` if the token is invalid or expired.
- `500` on server failure.

## Protected Routes Mounted At `/profile`

These routes come from [src/routes/profile.ts](/home/isaac/Documents/caya/Naija_Eats/backend/src/routes/profile.ts:1).

### `GET /profile/me`

Fetches the authenticated user's profile and user account details.

Success response:

```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "phone_number": "+2348000000000",
    "profile": {
      "id": "profile-uuid",
      "user_id": "user-uuid",
      "full_name": "Example User",
      "avatar_url": ""
    }
  }
}
```

### `PATCH /profile/me`

Updates the authenticated user's profile information.

Request body:

```json
{
  "full_name": "New Name",
  "avatar_url": "new-url",
  "phone_number": "+2348000000001"
}
```

Success response:

```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "phone_number": "+2348000000001",
    "profile": {
      "id": "profile-uuid",
      "user_id": "user-uuid",
      "full_name": "New Name",
      "avatar_url": "new-url"
    }
  }
}
```

## Protected Routes Mounted At `/`

These routes come from [src/routes/meals.ts](/home/isaac/Documents/caya/Naija_Eats/backend/src/routes/meals.ts:1).

### `POST /preference`

Saves onboarding data in one transaction across `budgets`, `household_profiles`, `user_preferences`, and `user_allergies`.

Request body:

```json
{
  "amount": "50000",
  "frequency": "monthly",
  "fluctuation_buffer": "5000",
  "household_size": "4",
  "daily_meals": "3",
  "is_dessert": false,
  "cooking_frequency": "daily",
  "preferences": ["high-protein", "local-meals"],
  "allergies": ["peanuts"]
}
```

Success response:

```json
{
  "success": true,
  "message": "Preferences saved successfully"
}
```

### `GET /meals`

Returns meals ordered alphabetically by name.

Optional query parameters:

- `category`

Example:

```text
GET /meals?category=lunch
```

Success response:

```json
{
  "success": true,
  "message": "Meals retrieved successfully",
  "data": [
    {
      "id": "meal-uuid",
      "name": "Jollof Rice",
      "category": "lunch",
      "price_min": "1500",
      "price_max": "2500",
      "prep_time_mins": 45,
      "dietary_tags": "spicy,popular",
      "instructions": "Cook rice with tomato base."
    }
  ]
}
```

### `POST /meals-plan/generate`

Creates a new active meal plan for the authenticated user.

Request body:

```json
{
  "items": [
    {
      "meal_id": "meal-uuid-1",
      "day_of_week": "monday",
      "meal_slot": "breakfast"
    }
  ]
}
```

Current implementation note:

- The route validates that `items` is a non-empty array.
- It currently creates only the parent `meal_plans` record and returns that record.
- It does not currently persist `meal_plan_items`.

Success response:

```json
{
  "success": true,
  "message": "Meal plan generated successfully",
  "data": {
    "id": "plan-uuid",
    "user_id": "user-uuid",
    "status": "active"
  }
}
```

Error responses:

- `400` if `items` is missing or empty.
- `500` on server failure.

### `GET /meals-plan/:id`

Fetches a meal plan by ID for the current user.

Current implementation note:

- This route returns only the `meal_plans` row.
- It does not include related `meal_plan_items` or meal details.

Success response:

```json
{
  "success": true,
  "message": "Meal plan retrieved successfully",
  "data": {
    "id": "plan-uuid",
    "user_id": "user-uuid",
    "status": "active"
  }
}
```

Error responses:

- `404` if the plan is not found.
- `500` on server failure.

## Protected Routes Mounted At `/api`

These routes come from [src/routes/onboarding.ts](/home/isaac/Documents/caya/Naija_Eats/backend/src/routes/onboarding.ts:1).

### `POST /api/users/preferences/budget`

Upserts budget preferences for the authenticated user.

Request body:

```json
{
  "budgetTier": "Standard",
  "budgetValue": "7000-10000",
  "frequency": "Weekly",
  "fluctuationBuffer": "10%"
}
```

Success response:

```json
{
  "success": true,
  "message": "Budget preferences saved successfully"
}
```

### `POST /api/users/preferences/frequency`

Upserts household and cooking-frequency preferences.

Request body:

```json
{
  "householdSize": "1",
  "dailyMeals": "3",
  "includeDesserts": false,
  "cookingFrequencies": "Daily (7 Days)"
}
```

Success response:

```json
{
  "success": true,
  "message": "Cooking frequency preferences saved successfully"
}
```

### `POST /api/users/preferences/food`

Replaces saved food preferences, allergies, and dietary tags for the authenticated user.

Request body:

```json
{
  "selectedPreferences": ["African", "Continental"],
  "allergies": "Peanuts",
  "dietaryTags": ["Gluten-Free"]
}
```

Success response:

```json
{
  "success": true,
  "message": "Food preferences saved successfully"
}
```

Implementation note:

- `allergies` is currently stored as a single string in one `user_allergies` row in this route.
- That differs from `POST /preference`, which accepts an array and creates multiple allergy rows.

### `POST /api/meal-plans/generate`

Creates an active meal plan and returns its ID.

Success response:

```json
{
  "success": true,
  "message": "Meal plan generated successfully",
  "data": {
    "planId": "plan-uuid"
  }
}
```

### `GET /api/meal-plans/current`

Returns the current active plan summary.

Current implementation note:

- The route checks whether an active plan exists for the authenticated user.
- If one exists, it returns a static `budgetStats` object rather than database-derived statistics.

Success response:

```json
{
  "success": true,
  "message": "Meal plan retrieved successfully",
  "data": {
    "budgetStats": {
      "weeklyBudget": "₦45,000",
      "totalMeals": 21,
      "prepTimeAvg": "35 Mins"
    }
  }
}
```

Error responses:

- `404` if no active plan exists.
- `500` on server failure.

### `GET /api/meal-plans/current/details`

Placeholder endpoint for current meal-plan details.

Current implementation note:

- The route currently returns an empty object.

Success response:

```json
{
  "success": true,
  "message": "Meal plan details retrieved successfully",
  "data": {}
}
```
