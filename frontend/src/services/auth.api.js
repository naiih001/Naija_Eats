const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authService = {
  async signIn(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to sign in");
    }

    if (data.data?.token) {
      localStorage.setItem("token", data.data.token);
      if (data.data.user) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
        if (data.data.user.onboarded === true) {
          localStorage.setItem("onboarded", "true");
        } else {
          localStorage.removeItem("onboarded");
        }
      }
    }

    return data;
  },

  async signUp(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log(data)

    if (data.data?.token) {
      localStorage.setItem("token", data.data.token);
      if (data.data.user) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }
    }

    return data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};
