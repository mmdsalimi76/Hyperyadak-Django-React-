// src/pages/ProductDetail/ProductDetail.jsx
import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../../hooks/useProduct";
import { useCart } from "../../context/CartContext";
import ProductComments from "./ProductComments";
import ProductImageGallery from "./ProductImageGallery";
import SimilarProducts from "./SimilarProducts";
import Loader from "../Common/Loader/Loader";

// Helper: number to Persian format
const toPersianNumber = (value) => {
  if (value === undefined || value === null) return "";
  return new Intl.NumberFormat("fa-IR").format(value);
};

function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { data: product, isLoading, error, refetch } = useProduct(slug);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [addToCartMessage, setAddToCartMessage] = useState("");
  const [copyLinkMessage, setCopyLinkMessage] = useState("");
  const addToCartRef = useRef(null);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [product?.id]);

  // Auto-hide messages
  useEffect(() => {
    if (addToCartMessage) {
      const timer = setTimeout(() => setAddToCartMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [addToCartMessage]);
  useEffect(() => {
    if (copyLinkMessage) {
      const timer = setTimeout(() => setCopyLinkMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyLinkMessage]);

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
        dir="rtl"
      >
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-4">
            خطا در بارگذاری محصول.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-sky-600 text-white px-6 py-2.5 rounded-xl shadow-md"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }
  if (!product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
        dir="rtl"
      >
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <p className="text-gray-700 font-medium">محصول مورد نظر یافت نشد.</p>
          <Link
            to="/products"
            className="inline-block mt-4 text-sky-600 hover:text-sky-700"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  const finalPrice = product.discount_price || product.price;
  const discountPercent =
    product.discount_price && product.price
      ? Math.round(
          ((product.price - product.discount_price) / product.price) * 100,
        )
      : null;
  const isInStock = product.is_available && product.stock > 0;

  const increaseQty = () => {
    if (product.stock && quantity >= product.stock) return;
    setQuantity((prev) => prev + 1);
  };
  const decreaseQty = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: product.image || null,
    };
    addToCart(productToAdd, quantity);
    setAddToCartMessage(`✅ ${product.name} به سبد خرید اضافه شد.`);
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyLinkMessage("✅ لینک محصول کپی شد!");
  };

  const tabs = [
    { id: "description", label: "توضیحات" },
    { id: "specs", label: "مشخصات" },
    ...(product.video_url ? [{ id: "video", label: "ویدئو" }] : []),
    { id: "comments", label: "نظرات" },
  ];

  return (
    <>
      <main
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8">
            <Link
              to="/"
              className="hover:text-sky-600 transition flex items-center gap-1"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              خانه
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/all-products" className="hover:text-sky-600 transition">
              محصولات
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium truncate">
              {product.name}
            </span>
          </nav>

          {/* Two columns: details + image */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" dir="ltr">
            {/* Left column – product info & actions */}
            <div className="lg:col-span-1" dir="rtl">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-6 sticky top-24 transition-all">
                <div className="flex flex-col space-y-6 text-right">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 leading-tight">
                      {product.name}
                    </h1>
                    {(product.category || product.brand) && (
                      <div className="flex flex-wrap gap-3 mt-3">
                        {product.category && (
                          <span className="inline-flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700">
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
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                              />
                            </svg>
                            {typeof product.category === "object"
                              ? product.category.name
                              : product.category_name || product.category}
                          </span>
                        )}
                        {product.brand && (
                          <span className="inline-flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700">
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            {typeof product.brand === "object"
                              ? product.brand.name
                              : product.brand_name || product.brand}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Price section */}
                  <div className="border-t border-b border-gray-100 py-5 space-y-3">
                    {discountPercent ? (
                      <>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-lg line-through text-gray-400">
                            {toPersianNumber(product.price)} تومان
                          </span>
                          <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {toPersianNumber(discountPercent)}٪ تخفیف
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent">
                            {toPersianNumber(finalPrice)}
                          </span>
                          <span className="text-base text-gray-500">تومان</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent">
                          {toPersianNumber(finalPrice)}
                        </span>
                        <span className="text-base text-gray-500">تومان</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity + add to cart */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-gray-700 font-medium">تعداد:</span>
                      <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm">
                        <button
                          onClick={decreaseQty}
                          disabled={quantity <= 1}
                          className="w-10 h-10 flex items-center justify-center text-xl font-bold hover:bg-gray-100 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-14 text-center font-medium">
                          {toPersianNumber(quantity)}
                        </span>
                        <button
                          onClick={increaseQty}
                          disabled={
                            !isInStock ||
                            (product.stock && quantity >= product.stock)
                          }
                          className="w-10 h-10 flex items-center justify-center text-xl font-bold hover:bg-gray-100 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* ✅ Yellow warning notice about shipping cost */}
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border-r-4 border-amber-500 rounded-lg text-sm text-amber-800">
                      <svg
                        className="w-5 h-5 shrink-0 mt-0.5 text-amber-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <span>هزینه ارسال به صورت پس کرایه می‌باشد.</span>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={!isInStock}
                      className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
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
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z"
                        />
                      </svg>
                      افزودن به سبد خرید
                    </button>
                    {addToCartMessage && (
                      <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg text-center">
                        {addToCartMessage}
                      </div>
                    )}
                  </div>

                  {/* Share */}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">اشتراک‌گذاری:</span>
                    <button
                      onClick={shareLink}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all hover:scale-110"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                    </button>
                    {copyLinkMessage && (
                      <span className="text-xs text-green-600">
                        {copyLinkMessage}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column – product image gallery */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 overflow-hidden">
                <ProductImageGallery
                  product={product}
                  isImageZoomed={isImageZoomed}
                  setIsImageZoomed={setIsImageZoomed}
                />
              </div>
            </div>
          </div>
          {/* Similar Products Carousel */}
          <SimilarProducts
            productId={product.id}
            categoryId={product.category?.id}
          />
          {/* Tabs Section */}
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 overflow-hidden">
            <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50/50 px-6 pt-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-base font-medium rounded-t-2xl transition-all ${activeTab === tab.id ? "bg-white text-sky-700 border-b-2 border-sky-600 shadow-sm" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-6 md:p-8">
              {activeTab === "description" && (
                <div className="prose max-w-none text-gray-700 leading-relaxed text-sm space-y-3">
                  {product.description.split("\n").map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              )}
              {activeTab === "specs" && (
                <div className="space-y-3">
                  {product.specifications &&
                  Object.keys(product.specifications).length > 0 ? (
                    <div className="bg-gray-50 rounded-2xl p-5 divide-y divide-gray-200">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex flex-wrap justify-between py-3 first:pt-0 last:pb-0"
                          >
                            <span className="font-semibold text-gray-800 min-w-[130px]">
                              {key}:
                            </span>
                            <span className="text-gray-700">{value}</span>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      مشخصاتی برای این محصول ثبت نشده است.
                    </p>
                  )}
                </div>
              )}
              {activeTab === "video" && product.video_url && (
                <div className="space-y-5">
                  {/* renderVideo function – keep your original implementation */}
                  <p className="text-sm text-gray-500 text-center">
                    ویدئوی معرفی محصول
                  </p>
                </div>
              )}
              {activeTab === "comments" && (
                <ProductComments productId={product.id} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Sticky mobile bar */}
      <div
        ref={addToCartRef}
        className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 shadow-2xl md:hidden z-20"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
            <button
              onClick={decreaseQty}
              disabled={quantity <= 1}
              className="w-10 h-10 rounded-full bg-white shadow-sm text-xl font-bold disabled:opacity-50"
            >
              -
            </button>
            <span className="font-bold w-8 text-center">
              {toPersianNumber(quantity)}
            </span>
            <button
              onClick={increaseQty}
              disabled={
                !isInStock || (product.stock && quantity >= product.stock)
              }
              className="w-10 h-10 rounded-full bg-white shadow-sm text-xl font-bold disabled:opacity-50"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className="flex-1 bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50"
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
            افزودن به سبد خرید ({toPersianNumber(finalPrice)} تومان)
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
