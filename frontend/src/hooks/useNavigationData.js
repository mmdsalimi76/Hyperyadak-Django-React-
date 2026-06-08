import { useQuery } from "@tanstack/react-query";
import { productAPI } from "../services/api";

export const useNavigationData = () => {
  return useQuery({
    queryKey: ["navigationData"],
    queryFn: async () => {
      const [catRes, carBrandRes, productBrandRes] = await Promise.all([
        productAPI.getCategories(),
        productAPI.getCarBrands(),
        productAPI.getProductBrands(),
      ]);
      return {
        categories: catRes.data.results || catRes.data,
        carBrands: carBrandRes.data.results || carBrandRes.data,
        productBrands: productBrandRes.data.results || productBrandRes.data,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
