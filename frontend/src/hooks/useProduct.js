// hooks/useProduct.js
import { useQuery } from "@tanstack/react-query";
import { productAPI } from "../services/api";

const fetchProduct = async (slug) => {
  const response = await productAPI.getProductBySlug(slug);
  return response.data;
};

export const useProduct = (slug) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug,
    retry: 1,
  });
};
