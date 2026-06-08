// HotSale.jsx
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../Common/Card/ProductCard";

const ArrowBackIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

function HotSale({ products }) {
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

  if (!products || products.length === 0) {
    return null;
  }

  const preparedProducts = products.map((product) => ({
    ...product,
    image:
      product.thumbnail_url ||
      (product.images && product.images.length > 0
        ? product.images[0].image
        : "/placeholder.png"),
  }));

  return (
    <section
      className="relative py-6 mx-2 sm:mx-4 bg-[#001746] rounded-[2rem] overflow-hidden shadow-2xl"
      dir="rtl"
    >
      {/* ──  BACKGROUND IMAGE LAYER ── */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <img
          src="/hotsale.webp"
          alt="Hot Sale Banner Background"
          className="w-full h-full object-cover opacity-50"
        />
        {/* Soft edge masking layers to seamlessly contain the image graphics within the cards area */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001746] via-transparent to-[#001746] opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001746] via-transparent to-[#001746] opacity-70" />
      </div>

      {/* ── CONTENT LAYER ── */}
      <div className="relative z-10 w-full">
        {/* Header Alignment Strip */}
        <div className="flex items-center justify-between mb-4 px-6 md:px-12">
          <div className="flex items-center gap-3">
            {/* Hot Sale Signature Pipeline — Red Accent Bar Indicator */}
            <div className="w-1.5 h-8 bg-[#dc2626] rounded-full shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
            {/* Headline — Special Offers */}
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md">
              تخفیف های ویژه
            </h2>
          </div>

          {/* View All Button */}
          <Link
            to="/all-products?is_hotsale=true"
            className="text-white hover:text-red-400 font-black text-sm flex items-center gap-1 hover:gap-2 transition-all duration-200 drop-shadow-[0_2px_8px_rgba(220,38,38,0.3)] bg-red-950/40 px-3 py-1.5 rounded-xl border border-red-900/40 backdrop-blur-sm"
          >
            مشاهده همه
            <ArrowBackIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Carousel Runway Frame */}
        <div className="relative group w-full px-2 md:px-6">
          {/* Navigation Controllers */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm text-gray-800 rounded-2xl p-3 shadow-xl hover:bg-white active:scale-95 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none hidden md:block"
            aria-label="اسکرول به چپ"
          >
            <ArrowBackIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm text-gray-800 rounded-2xl p-3 shadow-xl hover:bg-white active:scale-95 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none hidden md:block"
            aria-label="اسکرول به راست"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Endless Horizon Scroll Track Box */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-3 px-4 md:px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
          >
            {preparedProducts.map((product, idx) => (
              <div
                key={product.id}
                className="w-72 flex-shrink-0 rounded-2xl overflow-hidden snap-start shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Intact Original Card Markup */}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Page Indicator Badges */}
        <div className="flex justify-center mt-2 md:hidden">
          <div className="flex gap-1.5 bg-black/30 backdrop-blur-sm py-1.5 px-3 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#dc2626]"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
          </div>
        </div>
      </div>

      {/* Curve Bottom Section Matrix Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180 pointer-events-none opacity-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          className="relative block w-full h-[24px]"
        >
          <path
            fill="#000000"
            d="M1000,4.3V0H0v4.3C0.9,23.1,126.7,99.2,500,100S1000,22.7,1000,4.3z"
          ></path>
        </svg>
      </div>
    </section>
  );
}

export default HotSale;
