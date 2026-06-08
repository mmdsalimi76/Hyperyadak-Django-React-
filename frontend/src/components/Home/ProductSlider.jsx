import React, { useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../Common/Card/ProductCard";

const ArrowIcon = ({ className, direction = "left" }) => (
  <svg
    className={`${className} transition-transform duration-300`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    {direction === "left" ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        d="M15 19l-7-7 7-7"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        d="M9 5l7 7-7 7"
      />
    )}
  </svg>
);

function ProductSlider({ products, title, viewAllLink }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!products || products.length === 0) return null;

  const preparedProducts = products.map((product) => ({
    ...product,
    image:
      product.thumbnail_url ||
      (product.images && product.images.length > 0
        ? product.images[0].image
        : "/placeholder.png"),
  }));

  return (
    <section className="py-12  overflow-hidden w-full">
      {/* Container changed to true full-width spanning with edge-locked responsive layout */}
      <div className="w-full px-4 md:px-8">
        {/* Header Block - Pushed entirely to absolute left and right sides */}
        <div className="flex items-center justify-between mb-8 border-b border-[#c5c5d3]/10 pb-4 w-full">
          {/* Left Side: Navigation Link */}

          {/* Right Side: Title Block */}
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-[#0058be] rounded-full" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#00236f] tracking-tight">
              {title}
            </h2>
          </div>
          <Link
            to={viewAllLink}
            className="text-[#0058be] font-bold text-sm flex items-center gap-1.5 hover:text-[#00236f] group/link transition-colors duration-300"
          >
            <span>مشاهده‌ همه</span>
            <ArrowIcon
              direction="left"
              className="w-4 h-4 group-hover/link:-translate-x-1"
            />
          </Link>
        </div>

        {/* Viewport Slider Track Layout Context */}
        <div className="relative group w-full">
          {/* Edge-Aligned Left Navigation Paddle */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md rounded-xl p-3 border border-[#c5c5d3]/20 shadow-[0_10px_30px_-5px_rgba(0,35,111,0.08)] hover:bg-white hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center text-[#00236f]"
            aria-label="اسکرول به چپ"
          >
            <ArrowIcon direction="left" className="w-5 h-5" />
          </button>

          {/* Edge-Aligned Right Navigation Paddle */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md rounded-xl p-3 border border-[#c5c5d3]/20 shadow-[0_10px_30px_-5px_rgba(0,35,111,0.08)] hover:bg-white hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center text-[#00236f]"
            aria-label="اسکرول به راست"
          >
            <ArrowIcon direction="right" className="w-5 h-5" />
          </button>

          {/* Full-width Responsive Horizontal Scroll Track */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none w-full"
          >
            {preparedProducts.map((product, idx) => (
              <div
                key={product.id}
                className="w-72 flex-shrink-0 transition-all duration-500 hover:-translate-y-1.5"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Pagination Status Tickers */}
        <div className="flex justify-center gap-1.5 mt-4 md:hidden">
          <div className="w-4 h-1.5 rounded-full bg-[#0058be] transition-all duration-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#0058be]/20 transition-all duration-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#0058be]/20 transition-all duration-300" />
        </div>
      </div>
    </section>
  );
}

export default ProductSlider;
