import axiosInstance from "../../../utils/axiosInstance";

export const updateProfile = async (formData, lang = "en") => {
  const response = await axiosInstance.post(
    `/employees/profile?lang=${lang}`, 
    formData, 
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept-Language": lang,
      },
    }
  );
  return response.data;
};
