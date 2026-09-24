import axiosInstance from "../../../utils/axiosInstance";

// Login handler
export const loginUser = async (loginData) => {
  const response = await axiosInstance.post("/login", loginData);
  return response.data;
};

// Register handler
export const registerUser = async (registerData) => {
  const response = await axiosInstance.post("/register", registerData);
  return response.data;
};

// Forgot password handler
export const forgotPassword = async (forgotPasswordData) => {
  const response = await axiosInstance.post(
    "/forgot-password",
    forgotPasswordData,
  );
  return response.data;
};

// Verify OTP handler
export const verifyOTP = async (verifyOTPData) => {
  const response = await axiosInstance.post("/verify-otp", verifyOTPData);
  return response.data;
};

// Reset password handler
export const resetPassword = async (resetPasswordData) => {
  const response = await axiosInstance.post(
    "/reset-password",
    resetPasswordData,
  );
  return response.data;
};

