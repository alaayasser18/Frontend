import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getTodayAttendance } from "../api/attendanceApi";

export const getCurrentLocation = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      resolve({ latitude: null, longitude: null });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Geolocation not available or permission denied:", error?.message);
        resolve({ latitude: null, longitude: null });
      },
      {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 60000,
      }
    );
  });
};

export const useTodayAttendance = () => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ["attendance", "today", i18n.language],
    queryFn: async () => {
      const location = await getCurrentLocation();
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
