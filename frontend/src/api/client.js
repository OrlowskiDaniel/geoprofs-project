const BASE_URL = "/api";
const TOKEN_KEY = "geoprofs_token";

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Cannot connect to the server. Please check that the backend is running."
    );
  }

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("The server returned an unexpected response.");
    }
  }

  if (!response.ok) {
    const validationMessages = Object.values(data?.errors ?? {})
      .flat()
      .join(" ");

    const error = new Error(
      validationMessages ||
        data?.message ||
        `Request failed (${response.status}).`
    );

    error.status = response.status;
    error.errors = data?.errors ?? {};

    throw error;
  }

  return data;
}

export const api = {
  async login(email, password) {
    const data = await request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!data?.token) {
      throw new Error("The server did not return a login token.");
    }

    sessionStorage.setItem(TOKEN_KEY, data.token);

    return data;
  },

  async logout() {
    await request("/logout", {
      method: "POST",
    });

    clearToken();
  },

  getLeaveTypes() {
    return request("/leave-types");
  },

  getLeaveRequests() {
    return request("/leave-requests");
  },

  createLeaveRequest(data) {
    return request("/leave-requests", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  changePassword(currentPassword, newPassword, confirmation) {
    return request("/change-password", {
      method: "POST",
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmation,
      }),
    });
  },
};