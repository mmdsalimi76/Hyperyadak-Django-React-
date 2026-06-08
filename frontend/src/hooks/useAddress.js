// src/hooks/useAddress.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../services/api";

export const useSaveAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (addressData) => {
      const hasAddress = !!queryClient.getQueryData(["dashboard"])?.address;
      if (hasAddress) {
        return authAPI.updateAddress(addressData);
      } else {
        return authAPI.addAddress(addressData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authAPI.deleteAddress(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
