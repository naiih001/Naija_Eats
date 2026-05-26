#!/bin/bash

# Thorough API Test Script for Naija Eats Backend
# Organized into: PASS, FAIL, EDGE CASES, and E2E Sections

# BASE_URL=${1:-"https://naijaeats-production.up.railway.app"}
BASE_URL=${1:-"http://localhost:3000"}
RANDOM_ID=$RANDOM
TEST_EMAIL="thorough_${RANDOM_ID}@test.com"
TEST_PASSWORD="SecurePass123!"
TEST_NAME="Thorough User"
TEST_PHONE="+23480${RANDOM_ID}0000"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}   NAIJA EATS THOROUGH API TEST SUITE  ${NC}"
echo -e "${BLUE}=======================================${NC}"

# Helper function for requests
request() {
  local method=$1
  local endpoint=$2
  local data=$3
  local token=$4
  local expected_status=$5
  local description=$6

  echo -n -e "Testing [${YELLOW}$description${NC}] ... "

  local response
  local status
  local auth_header=""
  
  if [ -n "$token" ]; then
    auth_header="-H \"Authorization: Bearer $token\""
  fi

  if [ "$method" == "GET" ]; then
    response=$(curl -s -L -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
      -H "Authorization: Bearer $token")
  else
    response=$(curl -s -L -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $token" \
      -d "$data")
  fi

  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  local matched=false
  for exp in $expected_status; do
    if [ "$status" -eq "$exp" ]; then
      matched=true
      break
    fi
  done

  if [ "$matched" = true ]; then
    echo -e "${GREEN}PASS${NC} ($status)"
    return 0
  else
    echo -e "${RED}FAIL${NC} (Expected $expected_status, got $status)"
    # echo "Response: $body"
    return 1
  fi
}

# --- 1. SUCCESS CASES (PASS) ---
echo -e "\n${MAGENTA}SECTION 1: SUCCESS CASES (PASS)${NC}"

request "GET" "/health" "" "" 200 "Health Check"

# Register
request "POST" "/auth/register" "{
  \"full_name\": \"$TEST_NAME\",
  \"email\": \"$TEST_EMAIL\",
  \"phone_number\": \"$TEST_PHONE\",
  \"password\": \"$TEST_PASSWORD\"
}" "" 201 "Register User"

# Login
LOGIN_RESP=$(curl -s -L -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$TEST_EMAIL\", \"password\": \"$TEST_PASSWORD\"}")
TOKEN=$(echo "$LOGIN_RESP" | jq -r '.data.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo -e "Login to get Token ... ${GREEN}PASS${NC}"
else
    echo -e "Login to get Token ... ${RED}FAIL${NC}"
    exit 1
fi

request "GET" "/meals" "" "$TOKEN" 200 "Get All Meals"
request "GET" "/meals?category=breakfast" "" "$TOKEN" 200 "Get Filtered Meals"

# --- 2. FAILURE CASES (FAIL) ---
echo -e "\n${MAGENTA}SECTION 2: FAILURE CASES (FAIL)${NC}"

request "POST" "/auth/register" "{
  \"email\": \"$TEST_EMAIL\"
}" "" 400 "Register Missing Fields"

request "POST" "/auth/register" "{
  \"full_name\": \"New User\",
  \"email\": \"$TEST_EMAIL\",
  \"password\": \"password\"
}" "" "500 400" "Register Duplicate Email"

request "POST" "/auth/login" "{
  \"email\": \"$TEST_EMAIL\",
  \"password\": \"WrongPassword\"
}" "" 401 "Login Wrong Password"

request "POST" "/auth/login" "{
  \"email\": \"nonexistent@test.com\",
  \"password\": \"$TEST_PASSWORD\"
}" "" 401 "Login Non-existent User"

request "GET" "/meals" "" "" 401 "Unauthorized Access (No Token)"
request "GET" "/meals" "" "Invalid.Token.Here" 401 "Unauthorized Access (Invalid Token)"

request "GET" "/meals-plan/99999999-9999-9999-9999-999999999999" "" "$TOKEN" "404 500" "Get Non-existent Meal Plan ID"

# --- 3. EDGE CASES ---
echo -e "\n${MAGENTA}SECTION 3: EDGE CASES${NC}"

# Special characters in name
request "POST" "/auth/register" "{
  \"full_name\": \"Ușér Nãmé!@#\",
  \"email\": \"spec_chars_${RANDOM}@test.com\",
  \"phone_number\": \"$TEST_PHONE\",
  \"password\": \"$TEST_PASSWORD\"
}" "" 201 "Register with special chars in name"

# Very long password
LONG_PASS=$(printf 'p%.0s' {1..100})
request "POST" "/auth/register" "{
  \"full_name\": \"Long Pass User\",
  \"email\": \"long_pass_${RANDOM}@test.com\",
  \"phone_number\": \"$TEST_PHONE\",
  \"password\": \"$LONG_PASS\"
}" "" 201 "Register with 100 char password"

# SQL Injection attempt in login
request "POST" "/auth/login" "{
  \"email\": \"' OR 1=1 --\",
  \"password\": \"' OR '1'='1\"
}" "" 401 "Login SQL Injection attempt"

# Empty strings for required fields
request "POST" "/auth/register" "{
  \"full_name\": \"\",
  \"email\": \"\",
  \"phone_number\": \"\",
  \"password\": \"\"
}" "" 400 "Register with empty fields"

# --- 4. END-TO-END FLOW (E2E) ---
echo -e "\n${MAGENTA}SECTION 4: END-TO-END FLOW (E2E)${NC}"

E2E_EMAIL="e2e_${RANDOM}@test.com"
echo "Starting E2E Flow: New User Onboarding & Plan Generation"

request "POST" "/auth/register" "{
  \"full_name\": \"E2E User\",
  \"email\": \"$E2E_EMAIL\",
  \"phone_number\": \"$TEST_PHONE\",
  \"password\": \"$TEST_PASSWORD\"
}" "" 201 "E2E: 1. Register"

E2E_LOGIN=$(curl -s -L -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$E2E_EMAIL\", \"password\": \"$TEST_PASSWORD\"}")
E2E_TOKEN=$(echo "$E2E_LOGIN" | jq -r '.data.token')

# Note: routes under /api/ have authMiddleware, so they need the token
request "POST" "/api/users/preferences/budget" '{
  "budgetTier": "Premium",
  "budgetValue": "100000",
  "frequency": "Monthly",
  "fluctuationBuffer": "10000"
}' "$E2E_TOKEN" 200 "E2E: 2. Set Budget"

request "POST" "/api/users/preferences/frequency" '{
  "householdSize": "2",
  "dailyMeals": "3",
  "includeDesserts": true,
  "cookingFrequencies": "Daily"
}' "$E2E_TOKEN" 200 "E2E: 3. Set Frequency"

request "POST" "/api/users/preferences/food" '{
  "selectedPreferences": ["Rice", "Beans"],
  "allergies": "Nuts",
  "dietaryTags": ["Vegan"]
}' "$E2E_TOKEN" 200 "E2E: 4. Set Food"

GEN_PLAN_RESP=$(curl -s -L -X POST "$BASE_URL/api/meal-plans/generate" \
  -H "Authorization: Bearer $E2E_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{}")
PLAN_ID=$(echo "$GEN_PLAN_RESP" | jq -r '.data.planId')

if [ "$PLAN_ID" != "null" ] && [ -n "$PLAN_ID" ]; then
    echo -e "E2E: 5. Generate Plan ... ${GREEN}PASS${NC} (ID: $PLAN_ID)"
    request "GET" "/api/meal-plans/current" "" "$E2E_TOKEN" 200 "E2E: 6. Get Current Plan Status"
    # Note: "/api/meal-plans/current/details" was not found in grep, check app.ts/routes
else
    echo -e "E2E: 5. Generate Plan ... ${RED}FAIL${NC}"
fi

echo -e "\n${BLUE}=======================================${NC}"
echo -e "${BLUE}        TEST SUITE COMPLETED         ${NC}"
echo -e "${BLUE}=======================================${NC}"
