// src/hooks/usePasswordChange.js
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../services/api";

export const usePasswordChange = () => {
  return useMutation({
    mutationFn: (data) => authAPI.changePassword(data),
  });
};
