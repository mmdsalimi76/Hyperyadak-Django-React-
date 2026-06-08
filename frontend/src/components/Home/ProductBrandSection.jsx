// ProductBrandSection.jsx – Manual carousel with arrow buttons
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

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

function ProductBrandSection({ productBrands = [] }) {
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = import.meta.env?.VITE_API_URL || "http://localhost:8000";
    return `${baseUrl}${imagePath}`;
  };

  const BrandLogo = ({ brand }) => {
    const [imgError, setImgError] = useState(false);
    const imageUrl = getImageUrl(brand.logo);

    return (
      <Link
        to={`/product-brands/${brand.slug}`}
        className="flex-shrink-0 w-36 sm:w-44 md:w-48 h-20 sm:h-28 md:h-32 flex items-center justify-center select-none"
      >
        <div className="w-full h-full flex items-center justify-center px-4">
          {!imgError && imageUrl ? (
            <img
              src={imageUrl}
              alt={brand.name || "لوگوی برند"}
              className="w-full h-full object-contain object-center"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <span className="text-[#0058be] font-black text-xl tracking-wider">
              {brand.name ? brand.name.toUpperCase() : "BRAND"}
            </span>
          )}
        </div>
      </Link>
    );
  };

  if (!productBrands.length) {
    return (
      <section className="py-12 bg-white w-full overflow-hidden border-y border-gray-100/60">
        <div className="text-center py-8 text-gray-400">
          لوگوی برندی بارگذاری نشده است.
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white w-full overflow-hidden border-y border-gray-100/60">
      <div className="w-full px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-[#c5c5d3]/10 pb-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-[#0058be] rounded-full" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#00236f] tracking-tight">
              برندهای قطعات
            </h2>
          </div>
          <Link
            to="/product-brands"
            className="text-[#0058be] font-bold text-sm flex items-center gap-1.5 hover:text-[#00236f] group/link transition-colors duration-300"
          >
            <span>مشاهده همه</span>
            <ArrowIcon
              direction="left"
              className="w-4 h-4 group-hover/link:-translate-x-1"
            />
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative group w-full">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md rounded-xl p-3 border border-[#c5c5d3]/20 shadow-md hover:bg-white hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center text-[#00236f]"
            aria-label="قبلی"
          >
            <ArrowIcon direction="left" className="w-5 h-5" />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md rounded-xl p-3 border border-[#c5c5d3]/20 shadow-md hover:bg-white hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center text-[#00236f]"
            aria-label="بعدی"
          >
            <ArrowIcon direction="right" className="w-5 h-5" />
          </button>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none w-full"
          >
            {productBrands.map((brand) => (
              <BrandLogo key={brand.id || brand.slug} brand={brand} />
            ))}
          </div>
        </div>

        {/* Mobile pagination dots */}
        <div className="flex justify-center gap-1.5 mt-4 md:hidden">
          <div className="w-4 h-1.5 rounded-full bg-[#0058be] transition-all duration-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#0058be]/20 transition-all duration-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#0058be]/20 transition-all duration-300" />
        </div>
      </div>
    </section>
  );
}

export default ProductBrandSection;
