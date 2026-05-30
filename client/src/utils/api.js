import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.VITE_API_URL || "https://naaz-makeover-api.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Request Interceptor: Attach Auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("naaz_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't show toast if we are on the login page already
      if (!window.location.pathname.includes("/admin-login")) {
        toast.error("Session expired. Please log in again.");
      }
      localStorage.removeItem("naaz_admin_token");
      // Force redirect to login page
      window.location.href = "/admin-login";
    }
    return Promise.reject(error);
  }
);

export default api;
