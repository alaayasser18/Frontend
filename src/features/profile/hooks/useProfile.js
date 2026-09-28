import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const { setCurrentUser } = useAuth(); 

  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";

  const updateProfileMutation = useMutation({
    mutationFn: (formData) => updateProfile(formData, lang),
    onSuccess: (data) => {
      // Refresh user profile if we have an endpoint, or update context
      toast.success(data?.message || "Profile updated successfully");
      
      // Update central auth state if user data is returned
      if (data?.data) {
         setCurrentUser?.(data.data);
      }
      
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to update profile";
      toast.error(message);
    }
  });

  return {
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
};
