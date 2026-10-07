import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getTodayAttendance } from "../api/attendanceApi";

export const getCurrentLocation = ({ required = false } = {}) => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      if (required) {
        reject(new Error("Geolocation is not supported in this environment."));
      } else {
        resolve({ latitude: null, longitude: null });
      }
      return;
    }

    const getCachedLocation = () => {
      try {
        const cached = sessionStorage.getItem("workwise_last_location");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.latitude != null && parsed?.longitude != null) {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
      return null;
    };

    if (!navigator.geolocation) {
      const cached = getCachedLocation();
      if (cached) {
        resolve(cached);
        return;
      }
      if (required) {
        reject(
          new Error(
            localStorage.getItem("language") === "ar"
              ? "المتصفح لا يدعم تحديد الموقع الجغرافي."
              : "Geolocation is not supported by your browser."
          )
        );
      } else {
        resolve({ latitude: null, longitude: null });
      }
      return;
    }

    const handleSuccess = (position) => {
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      try {
        sessionStorage.setItem("workwise_last_location", JSON.stringify(coords));
      } catch {
        // ignore
      }
      resolve(coords);
    };

    const handleFailure = (error) => {
      console.warn("Geolocation attempt with high accuracy failed, retrying with low accuracy:", error?.message);

      // Retry once with enableHighAccuracy: false
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        (secondError) => {
          console.warn("Geolocation failed completely:", secondError?.message);
          const cached = getCachedLocation();
          if (cached) {
            resolve(cached);
            return;
          }

          if (required) {
            let errorMsg =
              localStorage.getItem("language") === "ar"
                ? "يرجى السماح بصلاحية الموقع الجغرافي (GPS) في المتصفح لتسجيل الحضور."
                : "Location permission is required for attendance check-in. Please enable location access in your browser.";

            if (secondError?.code === 1) {
              errorMsg =
                localStorage.getItem("language") === "ar"
                  ? "تم رفض إذن الوصول للموقع الجغرافي. يرجى تفعيله من إعدادات المتصفح."
                  : "Location permission was denied. Please enable it in browser settings.";
            } else if (secondError?.code === 2) {
              errorMsg =
                localStorage.getItem("language") === "ar"
                  ? "تعذر تحديد الموقع الجغرافي. يرجى التأكد من تشغيل الـ GPS."
                  : "Unable to retrieve location. Please make sure GPS is turned on.";
            } else if (secondError?.code === 3) {
              errorMsg =
                localStorage.getItem("language") === "ar"
                  ? "انتهت مهلة تحديد الموقع الجغرافي. يرجى المحاولة مرة أخرى."
                  : "Location request timed out. Please try again.";
            }

            reject(new Error(errorMsg));
          } else {
            resolve({ latitude: null, longitude: null });
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    };

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleFailure,
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 30000,
      }
    );
  });
};

export const useTodayAttendance = () => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ["attendance", "today", i18n.language],
    queryFn: async () => {
      const location = await getCurrentLocation({ required: false });
      return getTodayAttendance({
        latitude: location.latitude,
        longitude: location.longitude,
        lang: i18n.language,
      });
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};
