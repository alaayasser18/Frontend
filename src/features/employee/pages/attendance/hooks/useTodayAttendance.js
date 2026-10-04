import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getTodayAttendance } from "../api";

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
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
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
};

export const useTodayAttendance = () => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: [
      "attendance",
      "today",
      i18n.language,
    ],

    queryFn: async () => {
      const location = await getCurrentLocation();

      return getTodayAttendance({
        ...location,
        lang: i18n.language,
      });
    },

    enabled: true,

    retry: false,

    staleTime: 30 * 1000,
  });
};
