const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  const data = await response.json();
  console.log("Current meal plan response:", data);

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch current meal plan");
  }

  return data;
};

export const planService = {
  getCurrentMealPlan: () => getWithAuth("/api/meal-plans/current"),
};
