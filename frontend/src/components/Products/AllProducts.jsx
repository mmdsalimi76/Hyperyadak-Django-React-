// AllProducts.jsx – Optimised with React Query for shared navigation data and product caching
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import ProductCard from "../Common/Card/ProductCard";
import Loader from "../Common/Loader/Loader";
import { useNavigationData } from "../../hooks/useNavigationData";

function AllProducts() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: navData, isLoading: navLoading } = useNavigationData();

  // UI states
  const [carModels, setCarModels] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const PAGE_SIZE = 23;

  // Extract filter state from URL query params
  const searchParams = new URLSearchParams(location.search);
  const currentFilters = {
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    car_brand: searchParams.get("car_brand") || "",
    car_model: searchParams.get("car_model") || "",
    is_hotsale: searchParams.get("is_hotsale") === "true",
    ordering: searchParams.get("ordering") || "-created_date",
    page: parseInt(searchParams.get("page") || "1", 10),
  };

  // ---------- Fetch car models dynamically (still a simple useEffect) ----------
  React.useEffect(() => {
    if (currentFilters.car_brand) {
      const fetchCarModels = async () => {
        try {
          const res = await api.get("/products/api/v1/models/", {
            params: { brand: currentFilters.car_brand },
          });
          setCarModels(res.data.results || res.data);
        } catch (err) {
          console.error("Error fetching dependent vehicle models:", err);
        }
      };
      fetchCarModels();
    } else {
      setCarModels([]);
    }
  }, [currentFilters.car_brand]);

  // ---------- Fetch products with React Query (cached by URL) ----------
  const fetchProducts = async () => {
    const params = {
      page: currentFilters.page,
      page_size: PAGE_SIZE,
    };
    if (currentFilters.category) params.category = currentFilters.category;
    if (currentFilters.brand) params.brand = currentFilters.brand;
    if (currentFilters.is_hotsale) params.is_hotsale = "true";
    if (currentFilters.ordering) params.ordering = currentFilters.ordering;
    if (currentFilters.car_model) {
      params.compatible_cars = currentFilters.car_model;
    } else if (currentFilters.car_brand) {
      params.compatible_cars__brand = currentFilters.car_brand;
    }

    const response = await api.get("/products/api/v1/products/", { params });
    const data = response.data;
    if (data && typeof data === "object" && "results" in data) {
      return { products: data.results || [], totalCount: data.count || 0 };
    }
    const fallbackArray = Array.isArray(data) ? data : [];
    return { products: fallbackArray, totalCount: fallbackArray.length };
  };

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["allProducts", location.search],
    queryFn: fetchProducts,
    keepPreviousData: true,
    staleTime: 60 * 1000, // 1 minute
  });

  const products = productsData?.products || [];
  const totalCount = productsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // ---------- Helper functions (unchanged logic) ----------
  const updateURLFilters = (updatedFields) => {
    const nextParams = new URLSearchParams(location.search);
    Object.entries(updatedFields).forEach(([key, value]) => {
      if (
        value === "" ||
        value === false ||
        value === null ||
        value === undefined
      ) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });
    navigate(`/all-products?${nextParams.toString()}`, { replace: true });
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    const patches = { [name]: newValue, page: 1 };
    if (name === "car_brand") {
      patches.car_model = "";
    }
    updateURLFilters(patches);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      updateURLFilters({ page: pageNumber });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClearAllFilters = () => {
    navigate("/all-products", { replace: true });
    setMobileFiltersOpen(false);
  };

  // Extract filter options from shared navigation data (or empty arrays)
  const categories = navData?.categories || [];
  const productBrands = navData?.productBrands || [];
  const carBrands = navData?.carBrands || [];

  // Reusable UI component
  const FilterSelect = ({
    label,
    name,
    value,
    options,
    onChange,
    placeholder,
  }) => (
    <div className="space-y-1.5 text-right">
      <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all duration-150 text-xs font-bold text-gray-700 appearance-none cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  const FiltersSidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
        <h2 className="text-xs font-black text-gray-900 tracking-tight flex items-center gap-2">
          <svg
            className="w-4 h-4 text-[#00236f]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          فیلترهای پیشرفته قطعات
        </h2>
        <button
          onClick={handleClearAllFilters}
          className="text-[10px] text-rose-600 hover:text-rose-700 font-black transition-colors bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100/50"
        >
          حذف همه فیلترها
        </button>
      </div>

      <div className="space-y-4 flex-1">
        <FilterSelect
          label="دسته‌بندی فنی"
          name="category"
          value={currentFilters.category}
          options={categories}
          onChange={handleFilterChange}
          placeholder="مشاهده همه دسته‌ها"
        />
        <FilterSelect
          label="برند سازنده قطعه"
          name="brand"
          value={currentFilters.brand}
          options={productBrands}
          onChange={handleFilterChange}
          placeholder="مشاهده همه برندها"
        />
        <FilterSelect
          label="کمپانی خودرو"
          name="car_brand"
          value={currentFilters.car_brand}
          options={carBrands}
          onChange={handleFilterChange}
          placeholder="مشاهده همه کمپانی‌ها"
        />
        {currentFilters.car_brand && (
          <div className="pt-1">
            <FilterSelect
              label="مدل اختصاصی خودرو"
              name="car_model"
              value={currentFilters.car_model}
              options={carModels}
              onChange={handleFilterChange}
              placeholder="مشاهده تمامی مدل‌ها"
            />
          </div>
        )}

        <div className="pt-2">
          <label className="relative flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer select-none group hover:bg-amber-50/30 hover:border-amber-100/60 transition-all duration-150">
            <input
              type="checkbox"
              name="is_hotsale"
              checked={currentFilters.is_hotsale}
              onChange={handleFilterChange}
              className="w-4 h-4 text-amber-500 rounded-md border-gray-300 focus:ring-amber-500/20 focus:ring-2 transition cursor-pointer accent-amber-500"
            />
            <span className="text-xs font-black text-gray-700 flex items-center gap-1.5">
              🔥 آفرها و فروش ویژه قطعات
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  // Show global loader while navigation data is loading
  if (navLoading) return <Loader />;

  return (
    <div className="w-full text-right bg-gray-50/50 min-h-screen" dir="rtl">
      {/* Header Banner  */}
      <div className="w-full bg-[#00236f] py-10 md:py-12 text-center relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(30deg,#0058be_12%,transparent_12.1%),linear-gradient(150deg,#0058be_12%,transparent_12.1%)] bg-[size:32px_32px]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            فروشگاه جامع قطعات و لوازم یدکی
          </h1>
        </div>
      </div>

      <div className="w-full max-w-full px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-6 bg-white border border-gray-100 rounded-2xl shadow-2xs p-5">
              <FiltersSidebarContent />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <h3 className="text-sm font-black text-gray-900">
                  لیست محصولات قطعات
                </h3>
                <span className="bg-blue-50 border border-blue-100/50 text-[#0058be] font-mono font-black text-[11px] px-3 py-1 rounded-full">
                  {totalCount} کالای منطبق
                </span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex flex-1 items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  تنظیم فیلترها
                </button>
                <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                  <span className="text-[10px] font-black text-gray-400 whitespace-nowrap hidden sm:inline">
                    مرتب‌سازی بر اساس:
                  </span>
                  <select
                    name="ordering"
                    value={currentFilters.ordering}
                    onChange={handleFilterChange}
                    className="w-full sm:w-44 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-[#0058be]/10 focus:border-[#0058be]"
                  >
                    <option value="-created_date">جدیدترین اقلام</option>
                    <option value="price">ارزان‌ترین قطعات</option>
                    <option value="-price">گران‌ترین قطعات</option>
                    <option value="name">عنوان قطعه (الفبا)</option>
                  </select>
                </div>
              </div>
            </div>

            {productsLoading ? (
              <Loader />
            ) : productsError ? (
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
                <p className="text-rose-900 text-xs font-black">
                  خطا در بارگذاری لیست محصولات. لطفاً مجدداً تلاش کنید.
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl max-w-lg mx-auto p-8">
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
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="text-xs font-black text-gray-900 mb-1.5">
                  کالایی با فیلترهای مشخص‌شده یافت نشد
                </h3>
                <p className="text-[11px] font-bold text-gray-400 mb-6">
                  پارامترهای انتخاب شده را تغییر داده یا دکمه ریست زیر را
                  بفشارید.
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="bg-[#0058be] hover:bg-[#00236f] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all"
                >
                  نمایش مجدد کل کاتالوگ محصولات
                </button>
              </div>
            ) : (
              <>
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

                {totalPages > 1 && (
                  <div
                    className="flex items-center justify-center gap-2 mt-12"
                    dir="ltr"
                  >
                    <button
                      onClick={() => handlePageChange(currentFilters.page - 1)}
                      disabled={currentFilters.page === 1}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-40"
                    >
                      قبلی
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-9 h-9 text-xs font-mono font-bold rounded-xl transition-all ${
                            currentFilters.page === page
                              ? "bg-[#0058be] text-white shadow-sm"
                              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() => handlePageChange(currentFilters.page + 1)}
                      disabled={currentFilters.page === totalPages}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-40"
                    >
                      بعدی
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer (unchanged) */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs z-50 transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed top-0 bottom-0 left-0 w-full max-w-xs bg-white shadow-2xl z-50 p-5 flex flex-col border-r border-gray-100 transition-transform duration-300 transform translate-x-0">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
              <span className="text-xs font-black text-gray-900">
                فیلترهای جستجو
              </span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FiltersSidebarContent />
            </div>
            <div className="pt-4 border-t border-gray-100 mt-4">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-[#00236f] text-white py-3 rounded-xl text-xs font-black text-center shadow-2xs"
              >
                اعمال و مشاهده نتایج
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AllProducts;
