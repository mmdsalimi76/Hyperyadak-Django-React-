// src/hooks/useProfileUpdate.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../services/api";

export const useProfileUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => authAPI.updateProfile(data),
    onSuccess: (_, variables) => {
      // Update cached dashboard data optimistically
      queryClient.setQueryData(["dashboard"], (old) => ({
        ...old,
        first_name: variables.first_name,
        last_name: variables.last_name,
      }));
      // Also refresh the profile query if you have one
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
