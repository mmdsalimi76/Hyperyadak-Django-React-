// src/hooks/useDashboardData.js
import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../services/api";

const fetchDashboard = async () => {
  const response = await authAPI.getDashboard();
  return response.data;
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};
