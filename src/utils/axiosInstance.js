import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://nontelepathically-pamphletary-cyndi.ngrok-free.dev/",
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
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
