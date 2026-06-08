import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";

// Internal shopping cart icon
const AddCartIcon = ({ className }) => (
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
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z"
    />
  </svg>
);

function ProductCard({ product }) {
  const { addToCart } = useCart();

  if (!product || typeof product !== "object") return null;

  const imageUrl =
    product.thumbnail_url ||
    (product.images && product.images.length > 0
      ? product.images[0].image
      : "/placeholder.png");
  const productSlug = product.slug ?? product.id;
  const productName = product.name || "بدون نام";
  const categoryName =
    product.category_name || product.category?.name || "محصول";
  const originalPrice = product.price;
  const discountPrice = product.discount_price;
  const hasDiscount = !!(
    discountPrice &&
    originalPrice &&
    discountPrice < originalPrice
  );
  const finalPrice = hasDiscount ? discountPrice : originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
    : null;

  const formatPrice = (price) => {
    if (!price && price !== 0) return "—";
    const num = Math.round(price);
    const persianDigits = {
      0: "۰",
      1: "۱",
      2: "۲",
      3: "۳",
      4: "۴",
      5: "۵",
      6: "۶",
      7: "۷",
      8: "۸",
      9: "۹",
    };
    return num.toLocaleString("en-US").replace(/\d/g, (d) => persianDigits[d]);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error("Add to cart failed", error);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto group h-full">
      <Link
        to={`/product/${productSlug}`}
        className="flex flex-col h-full bg-[#f1f3ff] rounded-xl overflow-hidden shadow-md transition-all group-hover:shadow-lg border border-transparent hover:border-[#0058be]/20 text-right"
      >
        {/* Image container */}
        <div className="relative h-48 bg-white p-6 overflow-hidden shrink-0">
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />

          {/* Discount badge */}
          {discountPercent && (
            <div className="absolute top-3 right-3 bg-[#ba1a1a] text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md z-10">
              {discountPercent}٪ تخفیف
            </div>
          )}

          {/* Floating add to cart button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 w-10 h-10 bg-white shadow-md rounded-lg flex items-center justify-center text-[#00236f] transition-all duration-200 z-10
                       opacity-100 translate-y-0 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 hover:bg-gray-50"
            aria-label="افزودن به سبد خرید"
          >
            <AddCartIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
          <div className="space-y-1">
            <p className="text-[10px] text-[#0058be] font-bold uppercase tracking-widest">
              {categoryName}
            </p>
            <h3 className="text-sm font-medium text-[#141b2b] line-clamp-2 min-h-[40px]">
              {productName}
            </h3>
          </div>

          <div className="flex items-end justify-between pt-2">
            <div className="flex flex-col w-full">
              {hasDiscount ? (
                <span className="text-[11px] text-[#757682] line-through h-4 block">
                  {formatPrice(originalPrice)}
                </span>
              ) : (
                <span
                  className="text-[11px] h-4 block invisible select-none"
                  aria-hidden="true"
                >
                  —
                </span>
              )}
              <span className="text-[#00236f] font-bold text-lg leading-tight mt-0.5">
                {formatPrice(finalPrice)}{" "}
                <span className="text-[10px] font-normal text-[#444651]">
                  تومان
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
