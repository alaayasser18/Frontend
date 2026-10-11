import { useQuery } from "@tanstack/react-query";
import { getTodayAttendance } from "../api/attendanceApi";

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
  return useQuery({
    queryKey: ["attendance", "today"],

    queryFn: async () => {
      const location = await getCurrentLocation();

      return getTodayAttendance(location);
    },

    retry: false,

    staleTime: 30 * 1000,
  });
};
