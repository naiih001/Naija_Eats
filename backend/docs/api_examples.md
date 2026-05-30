# API Examples

These examples match the current backend implementation.

## Health Check

```bash
curl http://localhost:3000/health
```

## Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+2348000000000",
    "password": "password123"
  }'
```

## Log In

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Resend Verification Email

```bash
curl -X POST http://localhost:3000/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

## Forgot Password

```bash
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

## Reset Password

```bash
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset-token",
    "newPassword": "new-password123"
  }'
```

## Get User Profile

```bash
curl http://localhost:3000/profile/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Update User Profile

```bash
curl -X PUT http://localhost:3000/profile/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "New Name",
    "avatar_url": "new-url",
    "phone_number": "+2348000000001"
  }'
```

## Save Combined Preference Payload

```bash
curl -X POST http://localhost:3000/preference \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "50000",
    "frequency": "monthly",
    "fluctuation_buffer": "5000",
    "household_size": "4",
    "daily_meals": "3",
    "is_dessert": false,
    "cooking_frequency": "daily",
    "preferences": ["high-protein", "local-meals"],
    "allergies": ["peanuts", "shellfish"]
  }'
```

## Get Meals

```bash
curl http://localhost:3000/meals \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Filtered by category:

```bash
curl "http://localhost:3000/meals?category=lunch" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Generate Meal Plan From `/meals-plan/generate`

```bash
curl -X POST http://localhost:3000/meals-plan/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "meal_id": "meal-uuid-1",
        "day_of_week": "monday",
        "meal_slot": "breakfast"
      }
    ]
  }'
```

## Get Meal Plan By ID

```bash
curl http://localhost:3000/meals-plan/PLAN_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Save Budget Preferences

```bash
curl -X POST http://localhost:3000/api/users/preferences/budget \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "budgetTier": "Standard",
    "budgetValue": "7000-10000",
    "frequency": "Weekly",
    "fluctuationBuffer": "10%"
  }'
```

## Save Cooking Frequency Preferences

```bash
curl -X POST http://localhost:3000/api/users/preferences/frequency \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "householdSize": "1",
    "dailyMeals": "3",
    "includeDesserts": false,
    "cookingFrequencies": "Daily (7 Days)"
  }'
```

## Save Food Preferences

```bash
curl -X POST http://localhost:3000/api/users/preferences/food \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "selectedPreferences": ["African", "Continental"],
    "allergies": "Peanuts",
    "dietaryTags": ["Gluten-Free"]
  }'
```

## Generate Meal Plan From `/api/meal-plans/generate`

```bash
curl -X POST http://localhost:3000/api/meal-plans/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Get Current Meal Plan Summary

```bash
curl http://localhost:3000/api/meal-plans/current \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Get Current Meal Plan Details

```bash
curl http://localhost:3000/api/meal-plans/current/details \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
