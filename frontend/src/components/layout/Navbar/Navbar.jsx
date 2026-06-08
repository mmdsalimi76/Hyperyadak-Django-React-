// Navbar.jsx – Refactored: uses shared React Query hook for navigation data
import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useNavigationData } from "../../../hooks/useNavigationData";

const ChevronIcon = ({ className }) => (
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
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

// This component now only renders the three dropdown trigger buttons + their portaled dropdowns
export function NavbarDropdowns() {
  const { data, isLoading } = useNavigationData();
  const [openMenu, setOpenMenu] = useState(null);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const buttonRefs = useRef({});
  const closeTimeout = useRef(null);

  const handleMouseEnter = (menuName, e) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    const rect = e.currentTarget.getBoundingClientRect();
    let width = 280;
    if (menuName === "cars") width = 520;
    let right = window.innerWidth - rect.right;
    const minEdge = 24;
    if (right + width > window.innerWidth - minEdge) {
      right = window.innerWidth - width - minEdge;
    }
    if (right < 0) right = 0;
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 4,
      right: right,
      width: width,
    });
    setOpenMenu(menuName);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => setOpenMenu(null), 180);
  };

  const handleDropdownMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
  };

  const handleDropdownMouseLeave = () => {
    closeTimeout.current = setTimeout(() => setOpenMenu(null), 180);
  };

  if (isLoading) {
    return (
      <div className="text-sm text-gray-500 animate-pulse">
        در حال بارگذاری...
      </div>
    );
  }

  const { categories = [], carBrands = [], productBrands = [] } = data || {};

  return (
    <>
      {/* Three trigger buttons – no wrapper, just the raw buttons */}
      <button
        ref={(el) => (buttonRefs.current.products = el)}
        onMouseEnter={(e) => handleMouseEnter("products", e)}
        onMouseLeave={handleMouseLeave}
        className={`relative text-sm font-medium h-14 flex items-center transition-colors duration-200 outline-none ${openMenu === "products" ? "text-[#0058be]" : "text-[#141b2b] hover:text-[#0058be]"} after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0058be] after:rounded-full after:transition-transform after:duration-300 after:origin-center ${openMenu === "products" ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"} whitespace-nowrap`}
      >
        دسته‌بندی قطعات
      </button>
      <button
        ref={(el) => (buttonRefs.current.cars = el)}
        onMouseEnter={(e) => handleMouseEnter("cars", e)}
        onMouseLeave={handleMouseLeave}
        className={`relative text-sm font-medium h-14 flex items-center transition-colors duration-200 outline-none ${openMenu === "cars" ? "text-[#0058be]" : "text-[#141b2b] hover:text-[#0058be]"} after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0058be] after:rounded-full after:transition-transform after:duration-300 after:origin-center ${openMenu === "cars" ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"} whitespace-nowrap`}
      >
        خودرو
      </button>
      <button
        ref={(el) => (buttonRefs.current.productBrands = el)}
        onMouseEnter={(e) => handleMouseEnter("product-brands", e)}
        onMouseLeave={handleMouseLeave}
        className={`relative text-sm font-medium h-14 flex items-center transition-colors duration-200 outline-none ${openMenu === "product-brands" ? "text-[#0058be]" : "text-[#141b2b] hover:text-[#0058be]"} after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0058be] after:rounded-full after:transition-transform after:duration-300 after:origin-center ${openMenu === "product-brands" ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"} whitespace-nowrap`}
      >
        برند قطعات
      </button>

      {/* Portaled dropdowns */}
      {openMenu === "products" &&
        createPortal(
          <div
            className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(20,27,43,0.12)] border border-[#c5c5d3]/20 p-5 transition-all duration-300 z-[60] animate-fadeInSlideDown"
            style={dropdownStyle}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <div className="space-y-3 max-h-[65vh] overflow-y-auto">
              {categories
                .filter((cat) => cat.parent === null)
                .map((cat) => (
                  <div key={cat.id}>
                    <Link
                      to={`/categories/${cat.slug}`}
                      className="block text-sm font-semibold text-[#141b2b] hover:text-[#0058be] mb-1"
                      onClick={() => setOpenMenu(null)}
                    >
                      {cat.name}
                    </Link>
                    {cat.children?.length > 0 && (
                      <div className="pr-3 mt-1 space-y-1 border-r border-[#c5c5d3]/40">
                        {cat.children.map((child) => (
                          <Link
                            key={child.id}
                            to={`/categories/${child.slug}`}
                            className="block text-xs text-[#444651] hover:text-[#0058be] py-0.5"
                            onClick={() => setOpenMenu(null)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>,
          document.body,
        )}

      {openMenu === "cars" &&
        createPortal(
          <div
            className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(20,27,43,0.12)] border border-[#c5c5d3]/20 p-5 transition-all duration-300 z-[60] animate-fadeInSlideDown"
            style={dropdownStyle}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-h-[65vh] overflow-y-auto">
              {carBrands.map((brand) => (
                <div key={brand.id}>
                  <Link
                    to={`/car-brands/${brand.slug}`}
                    className="block text-sm font-semibold text-[#141b2b] hover:text-[#0058be] border-b border-gray-100 pb-1 mb-1.5"
                    onClick={() => setOpenMenu(null)}
                  >
                    {brand.name}
                  </Link>
                  {brand.models?.length > 0 && (
                    <div className="pr-3 mt-1 space-y-0.5 border-r border-transparent hover:border-[#0058be]/30">
                      {brand.models.map((model) => (
                        <Link
                          key={model.id}
                          to={`/car-models/${model.slug}`}
                          className="block text-xs text-[#444651]/90 hover:text-[#0058be] py-0.5"
                          onClick={() => setOpenMenu(null)}
                        >
                          {model.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}

      {openMenu === "product-brands" &&
        createPortal(
          <div
            className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(20,27,43,0.12)] border border-[#c5c5d3]/20 p-5 transition-all duration-300 z-[60] animate-fadeInSlideDown"
            style={dropdownStyle}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <div className="space-y-0.5 max-h-[50vh] overflow-y-auto">
              {productBrands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/product-brands/${brand.slug}`}
                  className="block text-xs font-medium px-3 py-2 rounded-lg text-[#444651] hover:text-[#0058be] hover:bg-[#0058be]/5"
                  onClick={() => setOpenMenu(null)}
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export default function Navbar() {
  console.warn(
    "Navbar default export is deprecated. Use NavbarDropdowns instead.",
  );
  return null;
}
