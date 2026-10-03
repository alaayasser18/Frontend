import axiosInstance from "../../../utils/axiosInstance";

export const getEmployeeById = async (id, lang = "en") => {
  if (!id) {
    throw new Error("Employee ID is required");
  }

  const response = await axiosInstance.get(`/employees/${id}`, {
    params: {
      lang,
    },
  });

  return response.data.data;
};
