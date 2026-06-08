// hooks/useProfile.js
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../services/api";

const fetchProfile = async () => {
  const response = await authAPI.getProfile();
  return response.data;
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Helper to manually refresh profile
export const useRefreshProfile = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["profile"] });
};
