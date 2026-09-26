import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://hr-system.iptvdemo.serv5group.com/api",
  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor: Attach Bearer token and language headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers.Accept = "application/json";

    const savedLng =
      localStorage.getItem("i18nextLng") ||
      (typeof document !== "undefined" ? document.documentElement.lang : "en");

    const currentLang = savedLng && savedLng.startsWith("ar") ? "ar" : "en";

    config.headers["Accept-Language"] = currentLang;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
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
