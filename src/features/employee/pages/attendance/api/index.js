
import axiosInstance from "../../../../utils/axiosInstance";

export const getTodayAttendance = async ({ latitude, longitude, lang = "en" }) => {
  if (latitude == null || longitude == null) {
    throw new Error("Location is required");
  }

  const response = await axiosInstance.get("/attendance/today", {
    params: {
      latitude,
      longitude,
    },
    headers: {
      "Accept-Language": lang,
    },
  });

  return response.data;
};
