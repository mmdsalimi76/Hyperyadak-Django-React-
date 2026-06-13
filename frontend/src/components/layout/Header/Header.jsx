// Header.jsx – Mobile menu fixed, auth inside drawer, about link bold
// Now uses shared React Query hook for navigation data
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { NavbarDropdowns } from "../Navbar/Navbar";
import { useNavigationData } from "../../../hooks/useNavigationData";
import {
  LogoIcon,
  SearchIcon,
  UserIcon,
  ChevronDownIcon,
  CartIcon,
  MenuIcon,
} from "./IconComponents";

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

export default function Header() {
  const { isAuthenticated, logout, profile } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const { data, isLoading } = useNavigationData();

  // UI states
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedCarBrandsMobile, setExpandedCarBrandsMobile] = useState({});

  const userMenuRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  // Extract navigation data (default to empty arrays)
  const productCategories = data?.categories || [];
  const carBrands = data?.carBrands || [];
  const productBrands = data?.productBrands || [];

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search modal logic
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => mobileSearchInputRef.current?.focus(), 50);
      const handleEsc = (e) => {
        if (e.key === "Escape") {
          setIsSearchOpen(false);
          setMobileSearchTerm("");
        }
      };
      document.addEventListener("keydown", handleEsc);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isSearchOpen]);

  // Lock scroll when mobile menu open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleMobileSearchSubmit = (searchValue) => {
    if (!searchValue.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchValue)}`);
    setIsSearchOpen(false);
    setMobileSearchTerm("");
  };

  const displayName =
    profile?.first_name || profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`.trim()
      : profile?.phone_number || "کاربر";

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };
  const toggleCarBrandModelsMobile = (brandId) => {
    setExpandedCarBrandsMobile((prev) => ({
      ...prev,
      [brandId]: !prev[brandId],
    }));
  };

  return (
    <>
      <header className="bg-[#f9f9ff]/80 backdrop-blur-md border-b border-[#c5c5d3]/30 fixed top-0 right-0 w-full z-50 flex items-center justify-between px-4 md:px-16 h-16">
        {/* Left section: mobile menu button & logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-[#00236f] hover:bg-[#1e3a8a]/10 p-2 rounded-lg transition-all active:scale-95 md:hidden"
            aria-label="منو"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <Link
            to="/"
            className="font-bold text-xl text-[#00236f] tracking-tight flex items-center gap-1"
          >
            <LogoIcon className="w-11 h-11" />
            <span className="hidden md:inline">
              هایپر
              <span className="text-[#0058be] font-normal">یدک</span>
            </span>
          </Link>
        </div>

        {/* Desktop navigation – includes static links and dropdown triggers */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link
            to="/"
            className="text-[#141b2b] hover:text-[#0058be] transition-colors text-sm font-medium h-14 flex items-center"
          >
            خانه
          </Link>
          <NavbarDropdowns />
          {/* About link – now with same boldness and hover as dropdown triggers */}
          <Link
            to="/about"
            className="text-[#141b2b] hover:text-[#0058be] transition-colors text-sm font-medium h-14 flex items-center"
          >
            درباره ما
          </Link>
        </nav>

        {/* Right section: search, cart, user */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-[#00236f] hover:bg-[#1e3a8a]/10 p-2 rounded-lg transition-all"
            aria-label="جستجو"
          >
            <SearchIcon className="w-6 h-6" />
          </button>
          <Link
            to="/cart"
            className="text-[#00236f] hover:bg-[#1e3a8a]/10 p-2 rounded-lg transition-all relative"
            aria-label="سبد خرید"
          >
            <CartIcon className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full" />
            )}
          </Link>
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1 p-2 rounded-lg text-[#00236f] hover:bg-[#1e3a8a]/10 transition"
              >
                <UserIcon className="w-6 h-6" />
                <span className="hidden md:inline text-sm font-medium">
                  {displayName}
                </span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>
              {userMenuOpen && (
                <div className="absolute left-0 md:left-auto md:right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-[#c5c5d3]/30 py-1 z-50">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-[#141b2b] hover:bg-[#0058be]/5"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    پیشخوان
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      navigate("/");
                    }}
                    className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    خروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-[#00236f] hover:bg-[#1e3a8a]/10 px-3 py-1.5 rounded-lg transition"
              >
                ورود
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium bg-[#0058be] text-white px-3 py-1.5 rounded-lg hover:bg-[#00236f] transition"
              >
                ثبت‌نام
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer (Sidebar) – now uses shared navigation data */}
      {isMobileMenuOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 bg-[#141b2b]/40 backdrop-blur-sm z-[99999]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <aside className="fixed top-0 right-0 h-full w-full sm:max-w-sm bg-white/75 backdrop-blur-2xl z-[100000] p-6 flex flex-col shadow-2xl border-l border-[#c5c5d3]/20 animate-slideInRight">
              <div className="flex justify-between items-center pb-4 border-b border-[#c5c5d3]/30">
                <h2 className="text-base font-bold text-[#141b2b]">منو</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-[#0058be]/5 text-[#444651]"
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
              <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1 custom-scrollbar">
                {/* Static links */}
                <div className="border-b border-[#c5c5d3]/10 pb-3">
                  <Link
                    to="/"
                    className="block py-2 text-[#141b2b] font-medium hover:text-[#0058be]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    خانه
                  </Link>
                  <Link
                    to="/about"
                    className="block py-2 text-[#141b2b] font-medium hover:text-[#0058be]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    درباره ما
                  </Link>
                </div>

                {/* Categories */}
                <div className="border-b border-[#c5c5d3]/10 pb-3">
                  <button
                    onClick={() => toggleSection("products")}
                    className={`flex justify-between w-full text-right font-medium text-sm py-2 ${expandedSections.products ? "text-[#0058be]" : "text-[#141b2b]"}`}
                  >
                    دسته‌بندی قطعات{" "}
                    <ChevronIcon
                      className={`w-4 h-4 transition-transform ${expandedSections.products ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedSections.products && (
                    <div className="pr-3 mt-1 space-y-1.5 border-r border-[#0058be]/20">
                      {productCategories
                        .filter((cat) => cat.parent === null)
                        .map((cat) => (
                          <div key={cat.id}>
                            <Link
                              to={`/categories/${cat.slug}`}
                              className="block text-sm font-medium text-[#444651] hover:text-[#0058be] py-1"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {cat.name}
                            </Link>
                            {cat.children?.length > 0 && (
                              <div className="pr-3 mt-1 space-y-1 border-r border-[#c5c5d3]/30">
                                {cat.children.map((child) => (
                                  <Link
                                    key={child.id}
                                    to={`/categories/${child.slug}`}
                                    className="block text-xs text-[#444651]/80 hover:text-[#0058be] py-1"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Car brands */}
                <div className="border-b border-[#c5c5d3]/10 pb-3">
                  <button
                    onClick={() => toggleSection("cars")}
                    className={`flex justify-between w-full text-right font-medium text-sm py-2 ${expandedSections.cars ? "text-[#0058be]" : "text-[#141b2b]"}`}
                  >
                    خودرو{" "}
                    <ChevronIcon
                      className={`w-4 h-4 transition-transform ${expandedSections.cars ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedSections.cars && (
                    <div className="pr-3 mt-1 space-y-3 border-r border-[#0058be]/20">
                      {carBrands.map((brand) => (
                        <div
                          key={brand.id}
                          className="bg-gray-50/50 p-1.5 rounded-lg"
                        >
                          <div className="flex justify-between">
                            <Link
                              to={`/car-brands/${brand.slug}`}
                              className="text-sm text-[#444651] font-medium hover:text-[#0058be]"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {brand.name}
                            </Link>
                            {brand.models?.length > 0 && (
                              <button
                                onClick={() =>
                                  toggleCarBrandModelsMobile(brand.id)
                                }
                                className="p-1 rounded-md hover:bg-[#0058be]/10"
                              >
                                <ChevronIcon
                                  className={`w-3.5 h-3.5 transition-transform ${expandedCarBrandsMobile[brand.id] ? "rotate-180" : ""}`}
                                />
                              </button>
                            )}
                          </div>
                          {brand.models?.length > 0 &&
                            expandedCarBrandsMobile[brand.id] && (
                              <div className="pr-3 mt-1.5 space-y-1 border-r border-[#c5c5d3]/40">
                                {brand.models.map((model) => (
                                  <Link
                                    key={model.id}
                                    to={`/car-models/${model.slug}`}
                                    className="block text-xs text-[#444651]/80 hover:text-[#0058be] py-0.5"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {model.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product brands */}
                <div>
                  <button
                    onClick={() => toggleSection("product-brands")}
                    className={`flex justify-between w-full text-right font-medium text-sm py-2 ${expandedSections["product-brands"] ? "text-[#0058be]" : "text-[#141b2b]"}`}
                  >
                    برند قطعات{" "}
                    <ChevronIcon
                      className={`w-4 h-4 transition-transform ${expandedSections["product-brands"] ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedSections["product-brands"] && (
                    <div className="pr-3 mt-1 grid grid-cols-2 gap-1.5 border-r border-[#0058be]/20">
                      {productBrands.map((brand) => (
                        <Link
                          key={brand.id}
                          to={`/product-brands/${brand.slug}`}
                          className="text-xs text-[#444651] hover:text-[#0058be] hover:bg-[#0058be]/5 p-1.5 rounded-md text-center"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {brand.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </>,
          document.body,
        )}

      {/* Search Overlay (unchanged) */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[200] bg-[#141b2b]/30 backdrop-blur-md flex items-start justify-center pt-24 px-4 animate-fadeIn"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-md transform transition-all animate-slideInDown"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={mobileSearchTerm}
                onChange={(e) => setMobileSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    handleMobileSearchSubmit(mobileSearchTerm);
                  if (e.key === "Escape") setIsSearchOpen(false);
                }}
                placeholder="جستجوی قطعات..."
                className="w-full px-5 py-3 text-base bg-white rounded-lg shadow-lg border border-[#c5c5d3]/40 focus:ring-2 focus:ring-[#0058be] focus:border-transparent outline-none text-[#141b2b]"
                autoComplete="off"
              />
              <button
                onClick={() => handleMobileSearchSubmit(mobileSearchTerm)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0058be] hover:text-[#00236f] transition"
              >
                <SearchIcon className="w-6 h-6" />
              </button>
            </div>
            <p className="text-center text-white text-xs mt-4 font-medium">
              برای جستجو کلید Enter را فشار دهید
            </p>
          </div>
        </div>
      )}

      <div className="pt-16" />
    </>
  );
}
