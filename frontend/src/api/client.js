// Tiny wrapper around fetch so every component talks to the API the same way.
// In dev, Vite proxies /api to the Laravel server (see vite.config.js).
const BASE_URL = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export const api = {
  hello: () => request("/hello"),
};
