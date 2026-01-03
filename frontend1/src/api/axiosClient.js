import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // important for CORS consistency
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Public routes (NO token)
  const publicRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/owner/signup",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    config.url?.startsWith(route)
  );

  if (isPublicRoute) {
    return config;
  }

  // Protected routes → attach token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
