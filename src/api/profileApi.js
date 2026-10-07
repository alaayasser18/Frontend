import axiosInstance from "../utils/axiosInstance";

/**
 * PATCH /api/employees/profile
 * Update authenticated user's profile.
 * Allowed for: All roles 📱
 *
 * @param {FormData|Object} data  FormData containing name, phone, address, locale, avatar
 * @param {string} [lang="en"]    Language query parameter ("en" | "ar")
 */
export const updateProfile = async (data, lang = "en") => {
  let body = data;
  if (!(data instanceof FormData)) {
    body = new FormData();
    if (data.name) body.append("name", data.name);
    if (data.phone) body.append("phone", data.phone);
    if (data.address) body.append("address", data.address);
    if (data.locale) body.append("locale", data.locale);
    if (data.avatar) body.append("avatar", data.avatar);
  }

  if (body instanceof FormData && !body.has("_method")) {
    body.append("_method", "PATCH");
  }

  const response = await axiosInstance.post(`/employees/profile`, body, {
    params: { lang },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export default {
  updateProfile,
};
