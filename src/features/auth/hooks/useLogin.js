import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
