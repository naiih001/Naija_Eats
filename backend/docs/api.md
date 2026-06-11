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

### `GET /auth/reset-password`

Validates a password-reset token via query parameter and redirects to the frontend.

---

### `POST /auth/reset-password`

Consumes a password reset token and stores a new password hash.

---

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
    "token": "jwt-token",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "phone_number": "+2348000000000",
      "isVerified": true,
      "created_at": "2026-01-01T00:00:00.000Z",
      "profile": {
        "id": "profile-uuid",
        "user_id": "user-uuid",
        "full_name": "Example User",
        "avatar_url": ""
      }
    }
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

## Protected Auth Routes

These routes require authentication and are mounted at `/auth` from [src/routes/auth.ts](/home/isaac/Documents/caya/Naija_Eats/backend/src/routes/auth.ts:1).

### `GET /auth/me`

Fetches the authenticated user's account details and profile.

Success response:

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "phone_number": "+2348000000000",
    "isVerified": true,
    "created_at": "2026-01-01T00:00:00.000Z",
    "profile": {
      "id": "profile-uuid",
      "user_id": "user-uuid",
      "full_name": "Example User",
      "avatar_url": ""
    }
  }
}
```

Error responses:

- `404` if user is not found.
- `500` on server failure.

### `PUT /auth/profile`

Updates the authenticated user's profile (full_name and avatar_url).

Request body:

```json
{
  "full_name": "New Name",
  "avatar_url": "new-url"
}
```

Success response:

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "profile-uuid",
    "user_id": "user-uuid",
    "full_name": "New Name",
    "avatar_url": "new-url"
  }
}
```

Error responses:

- `500` on server failure.

### `POST /auth/change-password`

Changes the authenticated user's password after verifying the old one.

Request body:

```json
{
  "oldPassword": "current-password",
  "newPassword": "new-password123"
}
```

Success response:

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

Error responses:

- `400` if `oldPassword` or `newPassword` is missing.
- `401` if the old password is incorrect.
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

### `PUT /profile/me`

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

## Protected Routes Mounted At `/meals`

These routes come from [src/routes/meals.ts](/home/isaac/Documents/caya/Naija_Eats/backend/src/routes/meals.ts:1).

### `POST /meals/preference`

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

### `GET /meals/`

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
  "data": {
    "meals": [
      {
        "id": "meal-uuid",
        "name": "Jollof Rice",
        "category": "lunch",
        "price_min": "1500",
        "price_max": "2500",
        "prep_time_mins": 45,
        "dietary_tags": "spicy,popular",
        "instructions": ["Rinse and parboil rice until slightly tender.", "Blend tomatoes, peppers, and onions into a smooth puree.", "Sauté the tomato puree in hot oil until reduced.", "Season with salt, curry, thyme, and seasoning cubes.", "Add parboiled rice and stock. Cover and cook on low heat.", "Stir gently and serve hot with fried plantains or chicken."]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### `POST /meals/meals-plan/generate`

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

### `GET /meals/meals-plan/:id`

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

### `GET /api/budget/status`

Calculates and returns the user's budget status based on their limit and active meal plan.

Success response:

```json
{
  "success": true,
  "message": "Budget status retrieved successfully",
  "data": {
    "limit": 15000,
    "currentSpending": 12500,
    "remaining": 2500,
    "overage": 0,
    "exceeded": false,
    "utilization": 83,
    "tier": "Premium",
    "frequency": "Weekly",
    "buffer": "15%",
    "planId": "plan-uuid"
  }
}
```

### `GET /api/users/preferences/budget`

Retrieves the user's raw budget settings and current status.

Success response:

```json
{
  "success": true,
  "message": "Budget preferences retrieved successfully",
  "data": {
    "budget": {
      "id": "budget-uuid",
      "user_id": "user-uuid",
      "tier": "Premium",
      "value": "15000",
      "frequency": "Weekly",
      "fluctuation_buffer": "15%"
    },
    "status": {
      "limit": 15000,
      "currentSpending": 12500,
      "utilization": 83,
      "exceeded": false
    }
  }
}
```

### `POST /api/users/preferences/budget`

Upserts budget preferences for the authenticated user.

Request body:

```json
{
  "budgetTier": "Standard",
  "budgetValue": "8500",
  "frequency": "Weekly",
  "fluctuationBuffer": "10%"
}
```

Implementation note:

- `budgetTier` is automatically calculated on the backend if not provided or to ensure consistency with amount thresholds.

Success response:

```json
{
  "success": true,
  "message": "Budget preferences saved successfully",
  "data": {
    "budget": { ... },
    "calculatedTier": "Standard"
  }
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

Returns the current active plan summary with real budget statistics.

Success response:

```json
{
  "success": true,
  "message": "Meal plan retrieved successfully",
  "data": {
    "plan": { ... },
    "budgetStats": {
      "weeklyBudget": "₦15,000",
      "currentSpending": "₦12,500",
      "totalMeals": 21,
      "prepTimeAvg": "35 Mins",
      "exceeded": false,
      "utilization": 83
    }
  }
}
```

Error responses:

- `404` if no active plan exists.
- `500` on server failure.

### `GET /api/meal-plans/current/details`

Returns detailed items of the current active meal plan.

Success response:

```json
{
  "success": true,
  "message": "Meal plan details retrieved successfully",
  "data": {
    "items": [
      {
        "id": "item-uuid",
        "meal": { "name": "Jollof Rice", ... },
        "day_of_week": "monday",
        "meal_slot": "lunch"
      }
    ]
  }
}
```

## Timetable Routes


### `GET /timetable/generate`
Retrieves the active timetable for the authenticated user.

**Success Response:**
```json
{
  "success": true,
  "message": "Timetable retrieved successfully",
  "data": {
    "id": "plan-uuid",
    "status": "active",
    "items": [
      {
        "id": "item-uuid",
        "meal": { 
          "name": "Jollof Rice", 
          "category": "Main", 
          "prep_time_mins": 60,
          "price_min": 1500,
          "price_max": 2500,
          "dietary_tags": "",
          "instructions": ["Rinse and parboil rice until slightly tender.", "Blend tomatoes, peppers, and onions into a smooth puree.", "Sauté the tomato puree in hot oil until reduced.", "Season with salt, curry, thyme, and seasoning cubes.", "Add parboiled rice and stock. Cover and cook on low heat.", "Stir gently and serve hot with fried plantains or chicken."]
        },
        "day_of_week": "Monday",
        "meal_slot": "Breakfast"
      }
    ]
  }
}
```

### `POST /timetable/generate`
Generates a new random timetable, deleting any existing active one.

**Request:**
```http
POST /timetable/generate
Authorization: Bearer <jwt_token>
```

**Success Response:**
```json
{
  "success": true,
  "message": "Timetable generated successfully",
  "data": {
    "id": "new-plan-uuid",
    "status": "active",
    "items": [
      {
        "id": "item-uuid",
        "meal": { 
          "name": "Jollof Rice", 
          "category": "Main", 
          "prep_time_mins": 60,
          "price_min": 1500,
          "price_max": 2500,
          "dietary_tags": "",
          "instructions": ["Rinse and parboil rice until slightly tender.", "Blend tomatoes, peppers, and onions into a smooth puree.", "Sauté the tomato puree in hot oil until reduced.", "Season with salt, curry, thyme, and seasoning cubes.", "Add parboiled rice and stock. Cover and cook on low heat.", "Stir gently and serve hot with fried plantains or chicken."]
        },
        "day_of_week": "Monday",
        "meal_slot": "Breakfast"
      }
    ]
  }
}
```

### `PUT /timetable/items/:itemId`

Swaps a single meal in the active timetable with a new one. Validates that the swap stays within budget.

**Request:**
```http
PUT /timetable/items/:itemId
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

```json
{
  "mealId": "new-meal-uuid"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "\"New Meal\" swapped in successfully",
  "data": {
    "id": "plan-uuid",
    "status": "active",
    "items": [
      {
        "id": "item-uuid",
        "meal": { "name": "New Meal" },
        "day_of_week": "Monday",
        "meal_slot": "Breakfast"
      }
    ]
  }
}
```

Error responses:

- `400` if `mealId` is missing or the swap exceeds budget.
- `404` if no active timetable or item is found.

> **Warning:** These routes are available for timetable generation but do not integrate with the budget statistics (`budgetStats`) provided by the `/api/meal-plans/` endpoints.

## Admin Routes

These routes require authentication and admin role, mounted at `/admin` from [src/routes/admin.ts](/home/isaac/Documents/caya/Naija_Eats/backend/src/routes/admin.ts:1).

### `PUT /admin/meals/:id/image`

Uploads an image for a meal. Accepts a multipart form with an `image` field. The image is uploaded to Cloudinary and the resulting URL is stored on the meal record.

**Request:**
```http
PUT /admin/meals/:id/image
Authorization: Bearer <admin_jwt_token>
Content-Type: multipart/form-data
```

Form field: `image` (file, max 5 MB, images only)

Success response:

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "image_url": "https://res.cloudinary.com/..."
  }
}
```

Error responses:

- `400` if no image file is provided.
- `404` if the meal is not found.
- `500` on upload failure.
