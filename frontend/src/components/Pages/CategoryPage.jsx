// src/components/Dashboard/CategoryPage.jsx
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import api from "../../services/api";
import ProductCard from "../Common/Card/ProductCard";
import { NotFound } from "../Common/errors";
import { isNotFoundError } from "../Common/errors/errorUtils";
import Loader from "../Common/Loader/Loader";

function CategoryPage() {
  const { slug } = useParams();

  // Helper: convert relative image path to absolute URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = import.meta.env?.VITE_API_URL || "http://localhost:8000";
    return `${baseUrl}${imagePath}`;
  };

  // 1. Fetch category details
  const {
    data: category,
    isLoading: categoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const res = await api.get(`/products/api/v1/categories/${slug}/`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // 2. Fetch products with infinite scroll (load more)
  const {
    data: productsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: productsLoading,
    error: productsError,
  } = useInfiniteQuery({
    queryKey: ["categoryProducts", category?.id],
    queryFn: async ({ pageParam = 1 }) => {
      if (!category?.id) return { results: [], next: null };
      const res = await api.get("/products/api/v1/products/", {
        params: { category: category.id, page: pageParam },
      });
      return {
        results:
          res.data.results?.filter((p) => p && typeof p === "object") || [],
        next: res.data.next,
        page: pageParam,
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      // Extract page number from next URL or increment manually
      const urlParams = new URLSearchParams(lastPage.next.split("?")[1]);
      const page = urlParams.get("page");
      return page ? parseInt(page, 10) : lastPage.page + 1;
    },
    enabled: !!category?.id,
    staleTime: 60 * 1000,
  });

  const products = productsData?.pages.flatMap((page) => page.results) || [];
  const isLoading = categoryLoading || (category?.id && productsLoading);
  const notFound = categoryError && isNotFoundError(categoryError);

  // Update document meta when category loaded
  useEffect(() => {
    if (category) {
      document.title = category.seo_title || `${category.name} | سپهر یدک`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = category.meta_description || "";
    }
  }, [category]);

  if (isLoading) {
    return <Loader />;
  }

  if (notFound) {
    return <NotFound />;
  }

  if (categoryError) {
    return (
      <div className="max-w-7xl mx-auto my-8 p-6 bg-white border border-gray-100 rounded-2xl text-center shadow-xs">
        <div className="text-rose-700 text-xs font-bold bg-rose-50 border border-rose-500/10 p-4 rounded-xl max-w-md mx-auto mb-4">
          خطا در بارگذاری دسته‌بندی
        </div>
        <Link
          to="/"
          className="text-xs font-black text-[#0058be] hover:underline"
        >
          بازگشت به صفحه اصلی سامانه
        </Link>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto my-8 p-12 text-center bg-white border border-gray-100 rounded-2xl shadow-xs">
        <p className="text-xs font-bold text-gray-400 mb-4">
          دسته‌بندی مورد نظر یافت نشد.
        </p>
        <Link
          to="/products"
          className="text-xs font-black text-[#0058be] hover:underline"
        >
          مشاهده تمام محصولات موجود
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full text-right" dir="rtl">
      {/* Hero Banner */}
      <div className="w-full bg-[#00236f] py-10 md:py-14 mb-10 text-center relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(30deg,#0058be_12%,transparent_12.1%),linear-gradient(150deg,#0058be_12%,transparent_12.1%)] bg-[size:32px_32px]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
          {category.image && (
            <div className="w-32 h-20 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xs mb-5 transition-transform hover:scale-[1.02]">
              <img
                src={getImageUrl(category.image)}
                alt={category.name}
                className="max-h-full max-w-full object-contain rounded-xl"
                onError={(e) => (e.target.parentNode.style.display = "none")}
              />
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4">
            {category.name}
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full border border-white/10">
            <span className="text-[10px] font-bold text-blue-200">
              گروه تخصصی قطعات یدکی
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-4 bg-[#0058be] rounded-full" />
          <h2 className="text-sm font-black text-[#00236f]">
            کالاهای موجود در این دسته‌بندی
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl shadow-xs p-6">
            <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mx-auto text-gray-400 mb-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <p className="text-xs font-bold text-gray-400 mb-4">
              هیچ محصولی در این دسته‌بندی یافت نشد.
            </p>
            <Link
              to="/products"
              className="inline-block text-xs font-black text-[#0058be] hover:underline"
            >
              مشاهده کاتالوگ جامع محصولات
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasNextPage && (
              <div className="text-center mt-12">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="bg-white border border-gray-200 text-[#24292f] hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 font-bold text-xs py-2.5 px-8 rounded-xl shadow-2xs disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isFetchingNextPage && (
                    <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-[#0058be] rounded-full animate-spin"></div>
                  )}
                  <span>
                    {isFetchingNextPage
                      ? "در حال دریافت اطلاعات..."
                      : "مشاهده بیشتر"}
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
