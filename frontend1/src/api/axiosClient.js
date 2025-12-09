import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // ❌ Do NOT add token for public routes
  const publicRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/owner/signup"
  ];

  if (publicRoutes.includes(config.url)) {
    return config;
  }

  // ✔ Only add token to protected routes
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});


export default api;
