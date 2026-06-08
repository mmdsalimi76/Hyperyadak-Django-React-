// src/components/Products/SearchResults.jsx
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../Common/Card/ProductCard";
import Loader from "../Common/Loader/Loader";

function SearchResults() {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get("search");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) {
        setProducts([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/products/api/v1/products/", {
          params: { search: searchTerm },
        });

        const data = response.data;
        if (data && typeof data === "object" && Array.isArray(data.results)) {
          setProducts(data.results);
          setTotalCount(data.count);
        } else if (Array.isArray(data)) {
          setProducts(data);
          setTotalCount(data.length);
        } else {
          setProducts([]);
          setTotalCount(0);
        }
      } catch (err) {
        console.error("Search system error pipeline:", err);
        setError(
          "خطا در بارگذاری نتایج جستجو. لطفاً ارتباط خود را بررسی کرده و مجدداً تلاش کنید.",
        );
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  return (
    <div className="w-full text-right bg-gray-50/50 min-h-screen" dir="rtl">
      {/* Premium Full-Width Header Banner Canvas */}
      <div className="w-full bg-[#00236f] py-10 md:py-12 text-center relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(30deg,#0058be_12%,transparent_12.1%),linear-gradient(150deg,#0058be_12%,transparent_12.1%)] bg-[size:32px_32px]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            مرکز جستجوی پیشرفته قطعات
          </h1>
        </div>
      </div>

      {/* Fluid Workspace Container spanning 100% display area width */}
      <div className="w-full max-w-full px-4 md:px-8 py-8">
        {/* Results Header Panel Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start">
            <h2 className="text-sm font-black text-gray-900">
              نتایج جستجو برای:{" "}
              <span className="text-[#0058be]">«{searchTerm || ""}»</span>
            </h2>
          </div>
          <span className="bg-blue-50 border border-blue-100/50 text-[#0058be] font-mono font-black text-[11px] px-3 py-1 rounded-full whitespace-nowrap">
            {totalCount} دستاورد کالا
          </span>
        </div>

        {/* Content Render Framework Switches */}
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-center py-16 bg-rose-50/50 rounded-2xl border border-rose-100 p-6 max-w-xl mx-auto">
            <svg
              className="w-12 h-12 text-rose-500 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-rose-900 text-xs font-black">{error}</p>
          </div>
        ) : products.length === 0 ? (
          /* Empty Matrix State Fallback View */
          <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl max-w-lg mx-auto p-8 shadow-2xs">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xs font-black text-gray-900 mb-1.5">
              کالایی منطبق با کلمه کلیدی شما یافت نشد
            </h3>
            <p className="text-[11px] font-bold text-gray-400 mb-6">
              املای واژه مورد نظر خود را بررسی کرده یا به ویترین اصلی بازگردید.
            </p>
            <Link
              to="/all-products"
              className="inline-block bg-[#0058be] hover:bg-[#00236f] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-2xs"
            >
              بازگشت به کاتالوگ جامع محصولات
            </Link>
          </div>
        ) : (
          <>
            {/* Dynamic Full Screen Product Grid Frame using shared ProductCard layout component */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="transition-all duration-200 hover:-translate-y-0.5"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination Load Extension Control Wrapper */}
            {totalCount > products.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => {
                    /* Handle Paginated Extension Data Pipeline Fetch */
                  }}
                  className="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-6 py-3 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-gray-100 transition shadow-2xs"
                >
                  مشاهده و بارگذاری اقلام بیشتر
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
