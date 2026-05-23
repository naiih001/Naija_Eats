const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const postWithAuth = async (endpoint, body) => {
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

  console.log("Body sent to", endpoint, ":", body);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to save preferences");
  }

  return data;
};

export const preferencesService = {
  saveBudgetPreferences: (data) => postWithAuth("/api/users/preferences/budget", data),
  saveCookingFrequency: (data) => postWithAuth("/api/users/preferences/cooking-frequency", data),
  saveFoodPreferences: (data) => postWithAuth("/api/users/preferences/food", data),
  generateMealPlans: () => postWithAuth("/api/meal-plans/generate"),

};
