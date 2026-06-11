const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handle401 = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/sign-in?expired=true";
};

export const authService = {
  async signIn(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const err = new Error(data.message || "Failed to sign in");
      err.status = response.status;
      throw err;
    }

    if (data.data?.token) {
      localStorage.setItem("token", data.data.token);
      let userObj;
      if (data.data?.user) {
        userObj = data.data.user;
        localStorage.setItem("user", JSON.stringify(userObj));
      } else {
        userObj = { email };
        localStorage.setItem("user", JSON.stringify(userObj));
      }

      // Migrate guest plan to user-specific plan key
      const guestPlan = localStorage.getItem("weekly_meal_plan");
      if (guestPlan) {
        const userKey = userObj.id ? `weekly_meal_plan_${userObj.id}` : `weekly_meal_plan_${userObj.email}`;
        localStorage.setItem(userKey, guestPlan);
        // Clear original guest cache
        localStorage.removeItem("weekly_meal_plan");
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

    if (!response.ok) {
      throw new Error(data.message || "Failed to create account");
    }

    return data;
  },

  // verify-email GET redirects to /verify-email?status=...
  // verify-email POST returns JSON — used by VerifyEmail.jsx
  async verifyEmail(token) {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Verification failed");
    }

    return data;
  },

  async resendVerification(email) {
    const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to resend verification email");
    }

    return data;
  },

  async forgotPassword(email) {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send reset email");
    }

    return data;
  },

  async resetPassword(token, newPassword) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reset password");
    }

    return data;
  },

  // GET /profile/me — fetch logged in user's profile
  async userInfo() {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please sign in again.");
    }

    const response = await fetch(`${API_BASE_URL}/profile/me`, {
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
      throw new Error(data.message || "Failed to fetch user info");
    }

    if (data.data) {
      localStorage.setItem("user", JSON.stringify(data.data));
    }

    return data;
  },

  // PUT /profile/me — update profile
  async updateProfile(updates) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please sign in again.");
    }

    const response = await fetch(`${API_BASE_URL}/profile/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (response.status === 401) {
      handle401();
      throw new Error("Your session has expired. Please sign in again.");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    if (data.data) {
      localStorage.setItem("user", JSON.stringify(data.data));
    }

    return data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

  },
};
