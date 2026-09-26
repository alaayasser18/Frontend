import axios from "axios";
console.log("API URL:", import.meta.env.VITE_API_BASE_URL);
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear central authentication state from storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("permissions");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("admin");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("rememberMe");

      if (typeof window !== "undefined") {
        // Notify React AuthContext to immediately reset state
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));

        const path = window.location.pathname;
        const isAuthPage =
          path.includes("/login") ||
          path.includes("/register") ||
          path.includes("/ForgotPassword") ||
          path.includes("/VerifyOTP") ||
          path.includes("/ResetPassword");

        if (!isAuthPage) {
          const redirectTo = path.startsWith("/admin")
            ? "/owner/login"
            : "/login";
          window.location.href = redirectTo;
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
