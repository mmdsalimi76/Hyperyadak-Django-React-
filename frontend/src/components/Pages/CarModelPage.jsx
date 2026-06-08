import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import ProductCard from "../Common/Card/ProductCard";
import { NotFound } from "../Common/errors";
import { isNotFoundError } from "../Common/errors/errorUtils";
import Loader from "../Common/Loader/Loader";

function CarModelPage() {
  const { slug } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 23;

  // Helper: convert relative image path to absolute URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = import.meta.env?.VITE_API_URL || "http://localhost:8000";
    return `${baseUrl}${imagePath}`;
  };

  // Reset page when slug changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [slug]);

  // 1. Fetch car model details
  const {
    data: model,
    isLoading: modelLoading,
    error: modelError,
  } = useQuery({
    queryKey: ["carModel", slug],
    queryFn: async () => {
      const res = await api.get(`/products/api/v1/models/${slug}/`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // 2. Fetch compatible products (paginated) – depends on model.id
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["carModelProducts", model?.id, currentPage],
    queryFn: async () => {
      if (!model?.id) return { products: [], totalCount: 0 };
      const res = await api.get("/products/api/v1/products/", {
        params: {
          compatible_cars: model.id,
          page: currentPage,
          page_size: PAGE_SIZE,
        },
      });
      const data = res.data;
      if (data && typeof data === "object" && "results" in data) {
        return { products: data.results || [], totalCount: data.count || 0 };
      }
      const fallbackArray = Array.isArray(data) ? data : [];
      return { products: fallbackArray, totalCount: fallbackArray.length };
    },
    enabled: !!model?.id,
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });

  const products = productsData?.products || [];
  const totalCount = productsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const isLoading = modelLoading || (model?.id && productsLoading);
  const notFound = modelError && isNotFoundError(modelError);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (notFound) {
    return <NotFound />;
  }

  if (modelError) {
    return (
      <div className="max-w-7xl mx-auto my-8 p-4 bg-rose-50 border border-rose-500/10 text-rose-700 text-xs font-bold rounded-xl text-center">
        خطا در بارگذاری مدل خودرو
      </div>
    );
  }

  if (!model) {
    return (
      <div className="max-w-7xl mx-auto my-8 p-12 text-center bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-400">
        مدل خودرو مورد نظر یافت نشد.
      </div>
    );
  }

  return (
    <div
      className="w-full text-right bg-gray-50/50 min-h-screen pb-12"
      dir="rtl"
    >
      {/* 100% Screen Full-Width Deep Corporate Blue Hero */}
      <div className="w-full bg-[#00236f] py-10 md:py-14 mb-8 text-center relative overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(30deg,#0058be_12%,transparent_12.1%),linear-gradient(150deg,#0058be_12%,transparent_12.1%)] bg-[size:32px_32px]"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
          {model.image && (
            <div className="w-32 h-20 bg-white rounded-2xl flex items-center justify-center p-3 shadow-sm mb-5 transition-transform hover:scale-[1.02]">
              <img
                src={getImageUrl(model.image)}
                alt={model.name}
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
            {model.name}
          </h1>

          <p className="text-xs md:text-sm font-bold text-blue-200/90 mb-4 tracking-wide">
            {model.brand_name}
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full border border-white/10">
            <span className="text-xs font-mono font-black text-white">
              {totalCount}
            </span>
            <span className="text-[10px] font-bold text-blue-200">
              قطعه یدکی سازگار
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Body Container */}
      <div className="w-full max-w-full px-4 md:px-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-4 bg-[#0058be] rounded-full" />
          <h2 className="text-sm font-black text-[#00236f]">
            قطعات و لوازم یدکی سازگار
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
              هیچ محصول یا قطعه سازگاری برای این مدل خودرو ثبت نشده است.
            </p>
          </div>
        ) : (
          <>
            {/* Products Grid Canvas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Component Bar */}
            {totalPages > 1 && (
              <div
                className="flex items-center justify-center gap-2 mt-12"
                dir="ltr"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white"
                >
                  قبلی
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 text-xs font-mono font-bold rounded-xl transition-all ${
                        currentPage === page
                          ? "bg-[#0058be] text-white shadow-sm"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white"
                >
                  بعدی
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CarModelPage;
