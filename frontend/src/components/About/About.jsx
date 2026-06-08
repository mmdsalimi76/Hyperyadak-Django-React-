import React from "react";
import { Link } from "react-router-dom";

const ShieldCheckIcon = () => (
  <svg
    className="w-8 h-8 text-[#0058be]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const ShippingIcon = () => (
  <svg
    className="w-8 h-8 text-[#0058be]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const VerifiedIcon = () => (
  <svg
    className="w-8 h-8 text-[#0058be]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

function AboutPage() {
  return (
    <div className="bg-[#f4f9ff] text-[#1e293b] min-h-screen font-sans">
      {/* 1. Light Elegant Hero Block */}
      <section className="relative w-full bg-gradient-to-br from-[#e0f2fe] via-[#f0f7ff] to-[#ffffff] py-24 md:py-32 overflow-hidden border-b border-[#0058be]/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,88,190,0.06),transparent_50%)]" />
        <div className="w-full px-4 md:px-8 text-center relative z-10 flex flex-col items-center">
          <span className="text-[#0058be] text-xs font-bold uppercase tracking-widest bg-[#0058be]/10 px-4 py-1.5 rounded-md mb-4 inline-block">
            پلتفرم تخصصی هایپر یدک
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#00236f] mb-6 tracking-tight">
            درباره <span className="text-[#0058be]">هایپر یدک</span>
          </h1>
          <p className="text-[#475569] text-base md:text-xl max-w-2xl font-medium leading-relaxed mb-8">
            ما در هایپر یدک فاصله میان تولید کننده و مصرف کننده را برداشته ایم
            تا شما بدون دغدغه های مرسوم بازار به کیفیت دسترسی داشته باشید.
          </p>
          <p className="text-[#475569] text-base md:text-xl max-w-2xl font-medium leading-relaxed mb-8">
            راحتی شما در خرید، ماموریت اصلی ماست.
          </p>
          <div>
            <Link
              to="/all-products"
              className="inline-flex items-center justify-center bg-[#0058be] text-white font-bold text-sm px-8 py-4 rounded-xl shadow-md hover:bg-[#0058be]/90 hover:shadow-[0_8px_25px_rgba(0,88,190,0.2)] active:scale-[0.98] transition-all duration-300"
            >
              ورود به فروشگاه مرکزی
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Brand Narrative / Our Story Block */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="w-full px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Visual Experience Badge Grid - Left Frame for RTL */}
          <div className="relative overflow-hidden rounded-2xl p-12 bg-gradient-to-br from-[#f0f7ff] to-[#e0f2fe] border border-[#0058be]/10 shadow-[0_12px_40px_-15px_rgba(0,88,190,0.1)] flex flex-col items-center justify-center text-center min-h-[300px]">
            <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-[#0058be]/5 rounded-full blur-3xl pointer-events-none" />

            <div class="flex flex-col items-center justify-center text-center">
              <img src="/logo.png" alt="Logo" class="w-20 h-auto mb-4" />

              <p class="text-2xl font-black text-[#00236f]">بیش از ۱۵ سال</p>
              <p class="text-[#475569] text-sm font-medium mt-1">
                حضور مستمر در بازار قطعات خودروی ایران
              </p>
            </div>
          </div>

          {/* Text History Node - Right Frame for RTL */}
          <div className="space-y-6 text-right">
            <div className="flex items-center gap-3 justify-start">
              <div className="w-1.5 h-7 bg-[#0058be] rounded-full" />
              <h2 className="text-2xl md:text-3xl font-black text-[#00236f] tracking-tight">
                داستان تکامل هایپر یدک
              </h2>
            </div>
            <p className="text-[#475569] leading-relaxed font-medium text-sm md:text-base">
              هایپر یدک از سال ۱۳۸۵ فعالیت ساختاری خود را در بازار توزیع قطعات
              یدکی آغاز کرد. زیربنای فکری ما همواره بر سه رکن اساسی **اصالت قطعی
              کالا**، **قیمت‌گذاری شفاف عادلانه** و **پشتیبانی فنی بی قید و
              شرط** استوار بوده است.
            </p>
            <p className="text-[#475569] leading-relaxed font-medium text-sm md:text-base">
              امروز با تکیه بر فناوری‌های پیشرفته دیجیتال و حذف واسطه‌های متعدد
              تجاری، مستقیم‌ترین کانال پیوند میان تولیدکنندگان تراز اول و
              مصرف‌کنندگان نهایی را فراهم ساخته‌ایم تا آرامش خاطر کامل را به
              پیشرانه خودروی شما هدیه دهیم.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Re-Engineered Security & Trust Badging Infrastructure */}
      <section className="w-full py-16 bg-[#eef5fc] border-y border-[#0058be]/10 relative overflow-hidden">
        <div className="w-full px-4 md:px-8 relative z-10">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[#0058be] text-xs font-bold uppercase tracking-widest bg-[#0058be]/10 px-3 py-1 rounded-md inline-block">
              امنیت
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-[#00236f] tracking-tight">
              زیرساخت ضمانت و خرید امن
            </h2>
            <p className="text-[#475569] text-sm max-w-xl mx-auto font-medium">
              تجربه خرید دیجیتال قطعات یدکی تحت بالاترین استانداردهای مالی و
              لجستیکی کشور
            </p>
          </div>

          {/* 3-Column Trust Metric Architecture Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Guarantee 1: Zarinpal Network */}
            <div className="relative overflow-hidden rounded-xl p-8 bg-white border border-[#0058be]/10 shadow-[0_4px_20px_rgba(0,88,190,0.04)] flex flex-col items-center text-center space-y-4 group hover:border-[#0058be]/40 hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-[#f0f7ff] flex items-center justify-center text-[#0058be] shadow-inner">
                <ShieldCheckIcon />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-[#00236f] text-lg">
                  درگاه امن زرین‌پال (Zarinpal)
                </h4>
                <p className="text-[#475569] text-xs font-medium leading-relaxed max-w-[280px] mx-auto">
                  تضمین امنیت کامل تراکنش‌های مالی به کمک پروتکل‌های امنیتی
                  زرین‌پال همراه با سیستم پرداخت آنلاین بدون وقفه و معتبر.
                </p>
              </div>
            </div>

            {/* Guarantee 2: On-Time Logistics Systems */}
            <div className="relative overflow-hidden rounded-xl p-8 bg-white border border-[#0058be]/10 shadow-[0_4px_20px_rgba(0,88,190,0.04)] flex flex-col items-center text-center space-y-4 group hover:border-[#0058be]/40 hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-[#f0f7ff] flex items-center justify-center text-[#0058be] shadow-inner">
                <ShippingIcon />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-[#00236f] text-lg">
                  ارسال زمان‌بندی شده و به‌موقع
                </h4>
                <p className="text-[#475569] text-xs font-medium leading-relaxed max-w-[280px] mx-auto">
                  سیستم هوشمند انبارداری و ارسال اکسپرس کشور؛ قطعات شما دقیقاً
                  در زمان مقرر و با بسته‌بندی پلمب فنی تحویل داده می‌شود.
                </p>
              </div>
            </div>

            {/* Guarantee 3: E-namad Legal Accreditation */}
            <div className="relative overflow-hidden rounded-xl p-8 bg-white border border-[#0058be]/10 shadow-[0_4px_20px_rgba(0,88,190,0.04)] flex flex-col items-center text-center space-y-4 group hover:border-[#0058be]/40 hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-[#f0f7ff] flex items-center justify-center text-[#0058be] shadow-inner">
                <VerifiedIcon />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-[#00236f] text-lg">
                  نماد اعتماد الکترونیکی (اینماد)
                </h4>
                <p className="text-[#475569] text-xs font-medium leading-relaxed max-w-[280px] mx-auto">
                  دارای مجوز رسمی و نماد اعتماد الکترونیکی وزارت صمت؛ فعالیت تحت
                  نظارت کامل مراجع قانونی جهت تأمین اصالت و حقوق خریدار.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Light & Vibrant Final Call to Action */}
      <section className="w-full py-20 bg-white overflow-hidden">
        <div className="w-full px-4 md:px-8 max-w-4xl mx-auto text-center space-y-6 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#00236f] tracking-tight">
            قطعه خود را همین حالا سفارش دهید
          </h2>
          <p className="text-[#475569] font-medium text-sm md:text-base max-w-xl leading-relaxed">
            با خیالی آسوده از درگاه پرداخت معتبر، تضمین رسمی اینماد و لجستیک
            فوق‌سریع هایپر یدک استفاده کنید. خودروی شما لایق برترین قطعات است.
          </p>
          <div className="pt-2">
            <Link
              to="/all-products"
              className="inline-flex items-center justify-center gap-3 bg-[#0058be] text-white font-bold text-sm px-10 py-4 rounded-xl shadow-lg hover:bg-[#0058be]/90 hover:shadow-[0_8px_25px_rgba(0,88,190,0.3)] active:scale-[0.98] transition-all duration-300 group"
            >
              <span>مشاهده و انتخاب قطعات</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
      </section>
    </div>
  );
}

export default AboutPage;
