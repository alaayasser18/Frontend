import axiosInstance from "../../../config/axiosInstance";

// Login
export const loginUser = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

// Register
export const registerUser = async (registerData) => {
  const response = await axiosInstance.post("/auth/register", registerData);
  return response.data;
};

// Forgot Password
export const forgotPassword = async (forgotPasswordData) => {
  const response = await axiosInstance.post(
    "/auth/forget-password",
    forgotPasswordData,
  );

  return response.data;
};

// Verify OTP
export const verifyOTP = async (verifyOTPData) => {
  const response = await axiosInstance.post(
    "/auth/forgot-password/verify-otp",
    verifyOTPData,
  );

  return response.data;
};

// Reset Password
export const resetPassword = async (resetPasswordData) => {
  const response = await axiosInstance.post(
    "/auth/forgot-password/reset",
    resetPasswordData,
  );

  return response.data;
};

// Resend OTP
export const resendOTP = async (resendOTPData) => {
  const response = await axiosInstance.post(
    "/auth/forgot-password/resend-otp",
    resendOTPData,
  );

  return response.data;
};
