import { useMutation } from "@tanstack/react-query";
import { verifyOTP } from "../api";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyOTP,
  });
};
