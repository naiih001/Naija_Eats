const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handle401 = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/sign-in?expired=true";
};

export const postWithAuth = async (endpoint, body) => {
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
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    handle401();
    throw new Error("Your session has expired. Please sign in again.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to save preferences");
  }

  return data;
};

export const preferencesService = {
  saveBudgetPreferences: (data) =>
    postWithAuth("/api/users/preferences/budget", data),
  saveCookingFrequency: (data) =>
    postWithAuth("/api/users/preferences/frequency", data),
  saveFoodPreferences: (data) =>
    postWithAuth("/api/users/preferences/food", data),

  /** generate a timetable from the saved preferences */
  generateTimetable: () => postWithAuth("/timetable/generate"),
};
