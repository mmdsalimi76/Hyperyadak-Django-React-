// src/components/Dashboard/ProductBrandPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import ProductCard from "../Common/Card/ProductCard";
import { NotFound } from "../Common/errors";
import { isNotFoundError } from "../Common/errors/errorUtils";
import Loader from "../Common/Loader/Loader";

function ProductBrandPage() {
  const { slug } = useParams();

  // Helper: convert relative image path to absolute URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = import.meta.env?.VITE_API_URL || "http://localhost:8000";
    return `${baseUrl}${imagePath}`;
  };

  // 1. Fetch product brand details
  const {
    data: brand,
    isLoading: brandLoading,
    error: brandError,
  } = useQuery({
    queryKey: ["productBrand", slug],
    queryFn: async () => {
      const res = await api.get(`/products/api/v1/product-brands/${slug}/`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // 2. Fetch products for this brand (depends on brand.id)
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["productBrandProducts", brand?.id],
    queryFn: async () => {
      if (!brand?.id) return [];
      const res = await api.get("/products/api/v1/products/", {
        params: { brand: brand.id },
      });
      return res.data.results || [];
    },
    enabled: !!brand?.id,
    staleTime: 60 * 1000,
  });

  const products = productsData || [];
  const isLoading = brandLoading || (brand?.id && productsLoading);
  const notFound = brandError && isNotFoundError(brandError);

  if (isLoading) {
    return <Loader />;
  }

  if (notFound) {
    return <NotFound />;
  }

  if (brandError) {
    return (
      <div className="max-w-7xl mx-auto my-8 p-4 bg-rose-50 border border-rose-500/10 text-rose-700 text-xs font-bold rounded-xl text-center">
        خطا در بارگذاری برند قطعات
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="max-w-7xl mx-auto my-8 p-12 text-center bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-400">
        برند قطعات مورد نظر یافت نشد.
      </div>
    );
  }

  return (
    <div
      className="w-full text-right bg-gray-50/50 min-h-screen pb-12"
      dir="rtl"
    >
      {/* Hero Section */}
      <div className="w-full bg-[#00236f] py-10 md:py-14 mb-8 text-center relative overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(30deg,#0058be_12%,transparent_12.1%),linear-gradient(150deg,#0058be_12%,transparent_12.1%)] bg-[size:32px_32px]"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
          {brand.logo && (
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-3 shadow-xs mb-5 transition-transform hover:scale-[1.02]">
              <img
                src={getImageUrl(brand.logo)}
                alt={brand.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
            {brand.name}
          </h1>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full border border-white/10">
            <span className="text-xs font-mono font-black text-white">
              {products.length}
            </span>
            <span className="text-[10px] font-bold text-blue-200">محصول</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-full px-4 md:px-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-4 bg-[#0058be] rounded-full" />
          <h2 className="text-sm font-black text-[#00236f]">
            محصولات عرضه شده توسط این تولیدکننده
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl shadow-xs p-6 max-w-xl mx-auto">
            <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mx-auto text-gray-400 mb-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <p className="text-xs font-bold text-gray-400">
              هیچ محصولی برای این برند قطعات در سامانه یافت نشد.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductBrandPage;
