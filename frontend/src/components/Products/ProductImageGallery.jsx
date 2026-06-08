import React, { useState } from "react";

function ProductImageGallery({ product, isImageZoomed, setIsImageZoomed }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const allImages = [];

  // Add thumbnail if it exists
  if (product.thumbnail_url) {
    allImages.push({ image: product.thumbnail_url, is_main: true });
  }

  // Add other images
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      if (img.is_main && !product.thumbnail_url) {
        allImages.unshift(img);
      } else if (!img.is_main || !product.thumbnail_url) {
        allImages.push(img);
      }
    });
  }

  // Fallback for no images
  if (allImages.length === 0) {
    allImages.push({ image: "/placeholder.png", is_main: true });
  }

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1,
    );
  };

  return (
    <div
      className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 min-h-[320px] md:min-h-[500px] cursor-zoom-in overflow-hidden group"
      onMouseEnter={() => setIsImageZoomed(true)}
      onMouseLeave={() => setIsImageZoomed(false)}
    >
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={allImages[currentImageIndex].image}
          alt={product.name}
          className={`max-w-full max-h-full object-contain transition-transform duration-500 ${isImageZoomed ? "scale-150" : "scale-100"}`}
        />
      </div>

      {/* Always visible navigation buttons when multiple images */}
      {allImages.length > 1 && (
        <>
          {/* Previous button */}
          <button
            onClick={goToPreviousImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white hover:scale-110 transition-all duration-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="تصویر قبلی"
          >
            <svg
              className="w-6 h-6"
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
          </button>

          {/* Next button */}
          <button
            onClick={goToNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white hover:scale-110 transition-all duration-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="تصویر بعدی"
          >
            <svg
              className="w-6 h-6"
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
        </>
      )}

      {/* Image counter – always visible when multiple images */}
      {allImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
          {currentImageIndex + 1} / {allImages.length}
        </div>
      )}
    </div>
  );
}

export default ProductImageGallery;
