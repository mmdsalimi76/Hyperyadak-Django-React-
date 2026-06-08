import React from "react";

function SideBySideBanner() {
  return (
    <section className="w-full py-12 bg-[#f9f9ff] overflow-hidden">
      {/* Edge-aligned responsive container grid */}
      <div className="w-full px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner 1: ENAMAD - Certified Shop */}
        <div className="relative overflow-hidden rounded-2xl p-8 md:p-12 bg-gradient-to-br from-[#516ec4] to-[#170667] border border-[#0058be]/20 shadow-[0_12px_40px_-12px_rgba(0,35,111,0.15)] group hover:-translate-y-1 transition-all duration-400 flex flex-row items-center justify-between min-h-[260px]">
          {/* Ambient micro light leak layer */}
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#0058be]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#0058be]/20 transition-colors duration-500" />

          <div className="relative z-10 flex-shrink-0">
            <img
              src="/enamad.png"
              alt="اعتماد الکترونیکی"
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
            />
          </div>

          <div className="relative z-10 flex flex-col text-right space-y-3 mr-6">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              فروشگاه معتمد
            </h3>
            <p className="text-white/70 text-sm md:text-base font-medium">
              ما یک فروشگاه معتمد الکترونیکی هستیم و تمام محصولات ما با ضمانت
              اصالت و کیفیت ارائه می‌شود.
            </p>
          </div>
        </div>

        {/* Banner 2: ZARINPAL - Secure Payment */}
        <div className="relative overflow-hidden rounded-2xl p-8 md:p-12 bg-gradient-to-bl from-[#516ec4] to-[#170667] border border-[#7c5329]/20 shadow-[0_12px_40px_-12px_rgba(37,26,14,0.15)] group hover:-translate-y-1 transition-all duration-400 flex flex-row items-center justify-between min-h-[260px]">
          {/* Warm premium amber/gold ambient glow layer */}
          <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-[#7c5329]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#7c5329]/20 transition-colors duration-500" />

          <div className="relative z-10 flex-shrink-0">
            <img
              src="/zarinpal.png"
              alt="درگاه پرداخت امن زرین پال"
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
            />
          </div>

          <div className="relative z-10 flex flex-col text-right space-y-3 mr-6">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              پرداخت ایمن
            </h3>
            <p className="text-white/70 text-sm md:text-base font-medium">
              تمام تراکنش‌های شما از طریق درگاه پرداخت ایمن زرین‌پال انجام
              می‌شود و اطلاعات شما کاملاً محفوظ است.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SideBySideBanner;
