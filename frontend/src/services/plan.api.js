const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handle401 = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/sign-in?expired=true";
};

const getWithAuth = async (endpoint) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    handle401();
    throw new Error("Your session has expired. Please sign in again.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch data");
  }

  return data;
};

const postWithAuth = async (endpoint, body = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (response.status === 401) {
    handle401();
    throw new Error("Your session has expired. Please sign in again.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to post data");
  }

  return data;
};

const putWithAuth = async (endpoint, body) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (response.status === 401) {
    handle401();
    throw new Error("Your session has expired. Please sign in again.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update data");
  }

  return data;
};

export const planService = {
  getCurrentMealPlan: () => getWithAuth("/api/meal-plans/current"),
  getTimetable: () => getWithAuth("/timetable/generate"),
  generateTimetable: () => postWithAuth("/timetable/generate"),
  getMeals: (category) =>
    getWithAuth(category ? `/meals?category=${category}&limit=100` : "/meals?limit=100"),
  createCustomMeal: (data) => postWithAuth("/meals/custom", data),
  updateTimetableItem: (itemId, mealId) => putWithAuth(`/timetable/items/${itemId}`, { mealId }),
};

