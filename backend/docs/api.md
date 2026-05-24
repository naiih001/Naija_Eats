# API Reference

The API is mounted from `src/app.ts`.

## Base URL

Local development defaults to:

```text
http://localhost:3000
```

## Health

### `GET /health`

Checks whether the server is running.

Response:

```json
{
  "status": "OK",
  "message": "Server is healthy"
}
```

## Auth Routes

Auth routes are mounted under `/auth` and do not require a bearer token.

### `POST /auth/register`

Registers a new user, hashes their password, and creates a profile.

Request body:

```json
{
  "full_name": "Example User",
  "email": "user@example.com",
  "phone_number": "+2348000000000",
  "password": "password"
}
```

Success response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com"
    },
    "token": "jwt-token"
  }
}
```

### `POST /auth/login`

Logs in an existing user and returns a JWT.

Request body:

```json
{
  "email": "user@example.com",
  "password": "password"
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

## Protected Routes

The routes below require:

```http
Authorization: Bearer <jwt_token>
```

The authentication middleware validates the JWT and attaches the user object (queried from the database via Prisma) to the request.

### `POST /preference`

Saves or updates onboarding and preference data for the authenticated user. This data is stored across `budgets`, `household_profiles`, `user_preferences`, and `user_allergies` models.

Request body:

```json
{
  "amount": 50000,
  "frequency": "monthly",
  "fluctuation_buffer": 5000,
  "household_size": 4,
  "daily_meals": 3,
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

Returns the catalogue of available meals. Can be filtered by category.

Optional query parameters:

```text
category=breakfast|lunch|dinner
```

Example: `GET /meals?category=lunch`

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
      "price_min": 1500,
      "price_max": 2500,
      "prep_time_mins": 45,
      "dietary_tags": ["spicy", "popular"]
    }
  ]
}
```

### `POST /meals-plan/generate`

> [!NOTE]
> There is also an alternative/duplicate endpoint implemented at `POST /api/meal-plans/generate`.

Creates a new active meal plan for the authenticated user and inserts the selected meal items.

Request body:

```json
{
  "items": [
    {
      "meal_id": "meal-uuid-1",
      "day_of_week": "monday",
      "meal_slot": "breakfast"
    },
    {
      "meal_id": "meal-uuid-2",
      "day_of_week": "monday",
      "meal_slot": "lunch"
    }
  ]
}
```

Success response:

```json
{
  "success": true,
  "message": "Meal plan generated successfully",
  "data": {
    "id": "plan-uuid",
    "user_id": "user-uuid",
    "status": "active",
    "meal_plan_items": [
      {
        "id": "item-uuid",
        "day_of_week": "monday",
        "meal_slot": "breakfast",
        "meals": {
          "id": "meal-uuid-1",
          "name": "Yam and Egg",
          "category": "breakfast",
          "price_min": 1000,
          "price_max": 1500,
          "prep_time_mins": 20,
          "dietary_tags": ["protein"]
        }
      }
    ]
  }
}
```

### `GET /meals-plan/:id`

Retrieves a specific meal plan by its ID, including all its meal items. Users can only fetch their own plans.

Success response:

```json
{
  "success": true,
  "message": "Meal plan retrieved successfully",
  "data": {
    "id": "plan-uuid",
    "user_id": "user-uuid",
    "status": "active",
    "meal_plan_items": [
      {
        "id": "item-uuid",
        "day_of_week": "monday",
        "meal_slot": "breakfast",
        "meals": {
          "id": "meal-uuid",
          "name": "Yam and Egg",
          "category": "breakfast",
          "price_min": 1000,
          "price_max": 1500,
          "prep_time_mins": 20,
          "dietary_tags": ["protein"],
          "instructions": "Preparation instructions"
        }
      }
    ]
  }
}
```

### `GET /ingredients/:planId`

> [!WARNING]
> This route is documented but **currently not implemented** in the backend code.

Returns shopping-list ingredients for a meal plan, grouped by market category (e.g., "Produce", "Proteins").

Success response:

```json
{
  "success": true,
  "message": "Ingredients retrieved successfully",
  "data": {
    "plan_id": "plan-uuid",
    "sections": {
      "Produce": [
        {
          "id": "item-uuid",
          "meal_plan_id": "plan-uuid",
          "name": "Tomatoes",
          "quantity": "6 large",
          "category": "Produce"
        }
      ],
      "Proteins": [
        {
          "id": "item-uuid",
          "meal_plan_id": "plan-uuid",
          "name": "Chicken",
          "quantity": "1kg",
          "category": "Proteins"
        }
      ]
    }
  }
}
```

## Onboarding / API Routes

The routes below are mounted under `/api` and also require a Bearer token.

### `POST /api/users/preferences/budget`

Saves or updates the user's budget preferences.

Request body:

```json
{
  "budgetTier": "standard",
  "budgetValue": 45000,
  "frequency": "weekly",
  "fluctuationBuffer": 5000
}
```

### `POST /api/users/preferences/frequency`

Saves or updates the user's household profile and cooking frequency preferences.

Request body:

```json
{
  "householdSize": 4,
  "dailyMeals": 3,
  "includeDesserts": false,
  "cookingFrequencies": "daily"
}
```

### `POST /api/users/preferences/food`

Saves or updates the user's food preferences, allergies, and dietary tags.

Request body:

```json
{
  "selectedPreferences": ["high-protein"],
  "allergies": "peanuts",
  "dietaryTags": ["halal"]
}
```

### `POST /api/meal-plans/generate`

Generates a new active meal plan.

> [!NOTE]
> This is a duplicate/alternative to the `POST /meals-plan/generate` route.

### `GET /api/meal-plans/current`

Retrieves the currently active meal plan and its budget stats.

### `GET /api/meal-plans/current/details`

Retrieves detailed breakdown of the current meal plan.

## Error Response Shape

Errors use the shared helper in `src/utils/helper.ts`:

```json
{
  "success": false,
  "message": "Error message"
}
```
