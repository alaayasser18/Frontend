import axios from "axios";

const API_URL = "YOUR_API_URL";
//login handler
export const loginUser = async (loginData) => {
  const response = await axios.post(`${API_URL}/login`, loginData);

  return response.data;
};
//register handler
export const registerUser = async (registerData) => {
  const response = await axios.post(`${API_URL}/register`, registerData);

  return response.data;
};
//forgot password handler
export const forgotPassword = async (forgotPasswordData) => {
  const response = await axios.post(
    `${API_URL}/forgot-password`,
    forgotPasswordData,
  );

  return response.data;
};
//verify OTP handler
export const verifyOTP = async (verifyOTPData) => {
  const response = await axios.post(`${API_URL}/verify-otp`, verifyOTPData);

  return response.data;
};
//reset password handler
export const resetPassword = async (resetPasswordData) => {
  const response = await axios.post(
    `${API_URL}/reset-password`,
    resetPasswordData,
  );

  return response.data;
};
