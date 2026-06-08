import React from "react";
import { Link } from "react-router-dom";

function ConsultationBanner() {
  return (
    <section className="w-full py-12 bg-[#f9f9ff] overflow-hidden">
      <div className="w-full px-4 md:px-8">
        {/* Background Image Container with strict containment boundaries */}
        <div
          className="relative bg-cover bg-center bg-no-repeat rounded-2xl overflow-hidden shadow-[0_12px_40px_-12px_rgba(0,35,111,0.15)] border border-[#c5c5d3]/10 min-h-[320px] md:min-h-[380px] flex items-center justify-center"
          style={{ backgroundImage: "url('/help.webp')" }}
        >
          {/* Balanced, symmetrical dark overlay gradient for perfectly centered text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#141b2b]/95 via-[#00236f]/80 to-[#141b2b]/95 z-0" />

          {/* Symmetrical ambient light glow */}
          <div className="absolute inset-x-0 top-0 h-40 bg-[#0058be]/10 blur-3xl pointer-events-none" />

          {/* Fully Centered Content Block */}
          <div className="relative z-10 w-full max-w-2xl px-6 py-12 md:py-16 flex flex-col items-center text-center space-y-4 md:space-y-6 mx-auto">
            <div className="space-y-3 flex flex-col items-center">
              <span className="text-white text-xs font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-md inline-block border border-white/5">
                پشتیبانی فنی و تخصصی
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                مشاوره رایگان خرید قطعات خودرو
              </h3>
            </div>

            <p className="text-white/80 text-sm sm:text-base font-medium max-w-lg leading-relaxed">
              پیش از انتخاب قطعه، با مهندسین و کارشناسان فنی ما ارتباط برقرار
              کنید تا بر اساس مدل دقیق خودرو، بهترین گزینه را به شما پیشنهاد
              دهند.
            </p>

            <div className="w-full sm:w-auto pt-2 flex justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-3 bg-[#0058be] text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg hover:bg-[#0058be]/90 hover:shadow-[0_0_25px_rgba(0,88,190,0.3)] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto group"
              >
                <span>شروع گفتگوی تخصصی</span>

                {/* Micro-kinetic arrow vector built for seamless RTL sliding */}
                <svg
                  className="w-4 h-4 transition-transform duration-300 ease-out group-hover:-translate-x-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConsultationBanner;
