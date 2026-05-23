const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const preferencesService = {

  async savePreferences(preferenceData) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please sign in again.");
      }

      console.log("Sending preference data:", preferenceData);

      const response = await fetch(`${API_BASE_URL}/api/users/preferences/budget`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(preferenceData),
      });

      const data = await response.json();
      


      if (!response.ok) {
        console.error("Preferences API Error Response:", data);
        throw new Error(data.message || "Failed to save preferences");

      }

      console.log("Preferences saved successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in savePreferences service:", error);
      throw error;
    }
  },
};
