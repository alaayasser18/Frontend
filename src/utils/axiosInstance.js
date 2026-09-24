import axios from "axios";

// Create Axios instance with base URL from Vite environment variables
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://hr-system.iptvdemo.serv5group.com/api",
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
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };
export default axiosInstance;
