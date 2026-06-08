import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { NotFound } from "../Common/errors";
import { isNotFoundError } from "../Common/errors/errorUtils";
import Loader from "../Common/Loader/Loader";

function CarBrandPage() {
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

  // Fetch brand details
  const {
    data: brand,
    isLoading: brandLoading,
    error: brandError,
  } = useQuery({
    queryKey: ["carBrand", slug],
    queryFn: async () => {
      const res = await api.get(`/products/api/v1/brands/${slug}/`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch paginated models (only when brand is loaded)
  const { data: modelsData, isLoading: modelsLoading } = useQuery({
    queryKey: ["carBrandModels", brand?.id, currentPage],
    queryFn: async () => {
      if (!brand?.id) return { models: [], totalCount: 0 };
      const res = await api.get("/products/api/v1/models/", {
        params: {
          brand: brand.id,
          page: currentPage,
          page_size: PAGE_SIZE,
        },
      });
      const data = res.data;
      if (data && typeof data === "object" && "results" in data) {
        return { models: data.results || [], totalCount: data.count || 0 };
      }
      const fallbackArray = Array.isArray(data) ? data : [];
      return { models: fallbackArray, totalCount: fallbackArray.length };
    },
    enabled: !!brand?.id,
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });

  const models = modelsData?.models || [];
  const totalCount = modelsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const isLoading = brandLoading || (brand?.id && modelsLoading);
  const notFound = brandError && isNotFoundError(brandError);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 350, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (notFound) {
    return <NotFound />;
  }

  if (brandError) {
    return (
      <div className="max-w-7xl mx-auto my-8 p-4 bg-rose-50 border border-rose-500/10 text-rose-700 text-xs font-bold rounded-xl text-center">
        خطا در بارگذاری برند خودرو
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="max-w-7xl mx-auto my-8 p-12 text-center bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-400">
        برند خودرو مورد نظر یافت نشد.
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
          {brand.logo && (
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-3 shadow-sm mb-5 transition-transform hover:scale-[1.02]">
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

          {brand.description && (
            <p className="text-xs md:text-sm font-medium text-blue-100/80 max-w-2xl leading-relaxed mx-auto mb-4">
              {brand.description}
            </p>
          )}

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full border border-white/10">
            <span className="text-xs font-mono font-black text-white">
              {totalCount}
            </span>
            <span className="text-[10px] font-bold text-blue-200">
              مدل خودرو
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Body Container */}
      <div className="w-full max-w-full px-4 md:px-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-4 bg-[#0058be] rounded-full" />
          <h2 className="text-sm font-black text-[#00236f]">مدل‌ها و تیپ‌ها</h2>
        </div>

        {/* Models Grid Canvas */}
        {models.length === 0 ? (
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-xs font-bold text-gray-400">
              هیچ مدل خودرویی برای این برند تخصیص داده نشده است.
            </p>
          </div>
        ) : (
          <>
            {/* Fluid responsive columns container */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-6 w-full">
              {models.map((model) => (
                <Link
                  key={model.id}
                  to={`/car-models/${model.slug}`}
                  className="group bg-white rounded-2xl shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 overflow-hidden border border-gray-100 flex flex-col justify-between w-full min-w-0"
                >
                  <div className="relative aspect-video bg-gray-50 overflow-hidden border-b border-gray-100 shrink-0">
                    {model.image ? (
                      <img
                        src={getImageUrl(model.image)}
                        alt={model.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-4 text-center bg-white transition-colors group-hover:bg-gray-50/30">
                    <span className="text-xs font-black text-[#1e293b] group-hover:text-[#0058be] transition-colors line-clamp-1 tracking-tight">
                      {model.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination controls */}
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

export default CarBrandPage;
