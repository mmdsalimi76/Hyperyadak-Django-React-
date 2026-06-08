// src/pages/ProductDetail/SimilarProducts.jsx
import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { productAPI } from "../../services/api";
import ProductCard from "../../components/Common/Card/ProductCard";

// Hook to fetch similar products (same category, fallback to latest)
const useSimilarProducts = (productId, categoryId, limit = 20) => {
  return useQuery({
    queryKey: ["similarProducts", productId, categoryId],
    queryFn: async () => {
      if (!productId) return [];
      // Try to fetch by category first
      if (categoryId) {
        try {
          const response = await productAPI.getProducts({
            category: categoryId,
            limit: limit,
            exclude: productId,
          });
          if (response.data?.results?.length) return response.data.results;
        } catch (e) {
          console.warn("No products in category, fallback to latest", e);
        }
      }
      // Fallback: latest products
      const response = await productAPI.getProducts({
        limit,
        exclude: productId,
      });
      return response.data?.results || [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!productId,
  });
};

function SimilarProducts({ productId, categoryId }) {
  const carouselRef = useRef(null);
  const { data: products = [], isLoading } = useSimilarProducts(
    productId,
    categoryId,
    20,
  );

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (isLoading || products.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">محصولات مشابه</h2>

        <div className="flex gap-2">
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-50 transition"
            aria-label="اسکرول به چپ"
          >
            →
          </button>
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-50 transition"
            aria-label="اسکرول به راست"
          >
            ←
          </button>
        </div>
      </div>
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 pb-4 hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="snap-start shrink-0 w-64">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default SimilarProducts;
