import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
<<<<<<< HEAD
    "https://nontelepathically-pamphletary-cyndi.ngrok-free.dev/",
=======
    "https://hr-system.iptvdemo.serv5group.com/api",
>>>>>>> 94e5bb941f491ba806820e60c361aa3aaf5150a3
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
      localStorage.removeItem("token");

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
