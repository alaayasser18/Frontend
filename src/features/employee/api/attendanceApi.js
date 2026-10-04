import axiosInstance from "../../../utils/axiosInstance";

export const getTodayAttendance = async ({
  latitude,
  longitude,
}) => {
  const response = await axiosInstance.get("/attendance/today", {
    params: {
      latitude,
      longitude,
    },
  });

  return response.data;
};

export const checkIn = async ({
  latitude,
  longitude,
}) => {
  const response = await axiosInstance.post(
    "/attendance/check-in",
    {
      latitude,
      longitude,
    },
  );

  return response.data;
};

export const checkOut = async () => {
  const response = await axiosInstance.post(
    "/attendance/check-out",
  );

  return response.data;
};

export const getAttendanceHistory = async ({
  month,
  year,
  perPage = 15,
}) => {
  const response = await axiosInstance.get(
    "/attendance/history",
    {
      params: {
        month,
        year,
        per_page: perPage,
      },
    },
  );

  return response.data;
};