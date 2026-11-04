const BASE_URL = "/api";

async function request(path, options = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        throw new Error(`API error ${res.status}: ${await res.text()}`);
    }

    return res.json();
}

export const api = {
    login: (email, password) =>
        request("/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    logout: () =>
        request("/logout", { method: "POST" }),

    getLeaveTypes: () =>
        request("/leave-types"),

    getLeaveRequests: () =>
        request("/leave-requests"),

    createLeaveRequest: (data) =>
        request("/leave-requests", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    getMe: () =>
        request("/me"),
};
