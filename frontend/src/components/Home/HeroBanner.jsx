// HeroBanner.jsx – Exact copy of the sample hero (card, gradients, buttons)
import React from "react";
import { Link } from "react-router-dom";

function HeroBanner() {
  return (
    <section className="relative w-full h-[530px] md:h-[707px] bg-surface-container-high overflow-hidden">
      {/* Background Image */}
      <img
        alt="تصویر اصلی قطعات خودرو"
        className="w-full h-full object-cover object-center absolute inset-0 brightness-[0.95]"
        src="/hero.webp"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-[#f9f9ff]/80 via-[#f9f9ff]/40 to-transparent pointer-events-none" />

      {/* Content Container  */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-16 max-w-[800px]">
        {/* Glass Panel */}
        <div className="bg-white/70 backdrop-blur-[10px] border border-white/50 rounded-xl p-8 md:p-12 space-y-6">
          {/* Tag Badge */}
          <div>
            <span className="inline-block py-1 px-3 bg-[#00236f]/10 text-[#00236f] rounded-full text-xs font-bold tracking-widest uppercase">
              مرجع تخصصی قطعات اورجینال
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl font-bold text-[#3360dc] leading-tight tracking-tight">
            از لنت ترمز تا قطعات موتور, <br />
            <span className="text-[#00236f] relative inline-block mt-2">
              هر چی نیاز داری اینجاست!
            </span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-[#444651] max-w-lg leading-relaxed">
            تامین قطعات اورجینال برای خودروها. با ما تجربه‌ای متفاوت از کیفیت و
            اصالت را احساس کنید.
          </p>

          {/* Buttons – exact same styling */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              to="/all-products"
              className="inline-flex items-center justify-center bg-[#00236f] text-white px-8 py-4 rounded-lg text-sm font-semibold hover:bg-[#00236f]/95 hover:shadow-[0_0_20px_rgba(0,88,190,0.15)] transition-all duration-200 active:scale-[0.98]"
            >
              مشاهده محصولات
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white/50 border border-[#00236f]/30 text-[#00236f] px-8 py-4 rounded-lg text-sm font-semibold hover:bg-white/80 transition-all duration-200 active:scale-[0.98]"
            >
              مشاوره تخصصی
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
