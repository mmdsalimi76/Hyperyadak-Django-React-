// src/hooks/useOrderActions.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../services/api";

export const usePayOrder = () => {
  return useMutation({
    mutationFn: (orderId) => authAPI.payOrder(orderId),
    onSuccess: (response) => {
      if (response.data?.payment_url) {
        window.location.href = response.data.payment_url;
      }
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId) => authAPI.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
