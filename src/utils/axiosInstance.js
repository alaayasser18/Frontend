import axios from "axios";

const axiosInstance = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_API_BASE_URL,
=======
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://hr-system.iptvdemo.serv5group.com/api",
>>>>>>> 204561478fe4849ca7cb20589d1043d437865934
  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

<<<<<<< HEAD
=======
// Request interceptor: Attach Bearer token and language headers
>>>>>>> 204561478fe4849ca7cb20589d1043d437865934
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

<<<<<<< HEAD
    return config;
  },
  (error) => Promise.reject(error),
=======
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
>>>>>>> 204561478fe4849ca7cb20589d1043d437865934
);

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
<<<<<<< HEAD
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
=======
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
>>>>>>> 204561478fe4849ca7cb20589d1043d437865934
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
