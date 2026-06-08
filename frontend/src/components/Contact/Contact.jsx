import React, { useState } from "react";

const PhoneIcon = () => (
  <svg
    className="w-6 h-6 text-[#0058be]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    className="w-6 h-6 text-[#0058be]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-6 h-6 text-[#0058be]"
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

const ChevronIcon = ({ isOpen }) => (
  <svg
    className={`w-5 h-5 text-[#0058be] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

function ContactPage() {
  // FAQ interactive state management
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "آیا تمامی قطعات موجود در هایپر یدک دارای ضمانت اصالت هستند؟",
      answer:
        "بله، اصالت قطعات خط قرمز هایپر یدک است. تمامی محصولات مستقیم از تولیدکنندگان یا نمایندگان رسمی برندها تأمین شده و با ضمانت کتبی اصالت کالا و پلمب فنی ارسال می‌شوند.",
    },
    {
      question: "مدت زمان ارسال سفارشات به چه صورت است؟",
      answer:
        "سفارشات شیراز از طریق پیک اکسپرس در کمتر از ۴ ساعت و سفارشات سایر استان‌ها از طریق سیستم لجستیک زمان‌بندی شده پست یا تیپاکس ظرف ۲۴ الی ۷۲ ساعت کاری به دست شما می‌رسند.",
    },
    {
      question: "چگونه می‌توانم از تطابق دقیق قطعه با خودروی خود مطمئن شوم؟",
      answer: "توصیه میشود قبل از خرید قطعه با مشاوران ما تماس حاصل فرمایید",
    },
  ];

  return (
    <div className="bg-[#f4f9ff] text-[#1e293b] min-h-screen font-sans">
      {/* 1. Hero Block with Soft Light Blue Gradients */}
      <section className="relative w-full bg-gradient-to-br from-[#e0f2fe] via-[#f0f7ff] to-[#ffffff] py-20 md:py-28 overflow-hidden border-b border-[#0058be]/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,88,190,0.06),transparent_50%)]" />
        <div className="w-full px-4 md:px-8 text-center relative z-10 flex flex-col items-center">
          <span className="text-[#0058be] text-xs font-bold uppercase tracking-widest bg-[#0058be]/10 px-4 py-1.5 rounded-md mb-4 inline-block">
            مرکز ارتباطات و پشتیبانی فنی
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#00236f] mb-4 tracking-tight">
            ارتباط با <span className="text-[#0058be]">هایپر یدک</span>
          </h1>
          <p className="text-[#475569] text-base md:text-lg max-w-2xl font-medium leading-relaxed">
            کارشناسان مجرب ما در تمامی روزهای هفته آماده پاسخگویی به سوالات
            تخصصی شما و ارائه مشاوره‌های خرید سیستم‌های فنی خودرو هستند.
          </p>
        </div>
      </section>

      {/* 2. Structured Information Cards (No Physical Location Card) */}
      <section className="w-full py-16 bg-white">
        <div className="w-full px-4 md:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Communication Node: Phone Call */}
            <div className="relative overflow-hidden rounded-xl p-8 bg-gradient-to-br from-[#f0f7ff] to-[#e0f2fe] border border-[#0058be]/10 shadow-[0_8px_30px_rgba(0,88,190,0.04)] flex flex-col items-center text-center space-y-4 group hover:border-[#0058be]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-md">
                <PhoneIcon />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[#00236f] text-lg">
                  تلفن‌های تماس مستقیم
                </h3>
                <p
                  className="text-[#475569] font-semibold text-sm tracking-wider"
                  dir="ltr"
                >
                  ۰۲۱ - ۱۲۳۴۵۶۷۸
                </p>
                <p
                  className="text-[#475569] font-semibold text-sm tracking-wider"
                  dir="ltr"
                >
                  ۰۲۱ - ۸۷۶۵۴۳۲۱
                </p>
              </div>
            </div>

            {/* Communication Node: Emails */}
            <div className="relative overflow-hidden rounded-xl p-8 bg-gradient-to-br from-[#f0f7ff] to-[#e0f2fe] border border-[#0058be]/10 shadow-[0_8px_30px_rgba(0,88,190,0.04)] flex flex-col items-center text-center space-y-4 group hover:border-[#0058be]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-md">
                <EmailIcon />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[#00236f] text-lg">
                  پست الکترونیک رسمی
                </h3>
                <p className="text-[#475569] font-medium text-sm tracking-wide">
                  info@hiperyadak.com
                </p>
                <p className="text-[#475569] font-medium text-sm tracking-wide">
                  support@hiperyadak.com
                </p>
              </div>
            </div>

            {/* Communication Node: Hours */}
            <div className="relative overflow-hidden rounded-xl p-8 bg-gradient-to-br from-[#f0f7ff] to-[#e0f2fe] border border-[#0058be]/10 shadow-[0_8px_30px_rgba(0,88,190,0.04)] flex flex-col items-center text-center space-y-4 group hover:border-[#0058be]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-md">
                <ClockIcon />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[#00236f] text-lg">
                  ساعات پاسخگویی واحد فروش
                </h3>
                <p className="text-[#475569] font-medium text-sm">
                  شنبه تا چهارشنبه: ۹:۰۰ الی ۱۷:۰۰
                </p>
                <p className="text-[#475569] font-medium text-sm">
                  پنجشنبه‌ها: ۹:۰۰ الی ۱۳:۰۰
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Re-Engineered Interactive FAQ Section Instead of Form/Map */}
      <section className="w-full py-16 bg-[#eef5fc] border-t border-[#0058be]/10 relative overflow-hidden">
        <div className="w-full px-4 md:px-8 max-w-4xl mx-auto relative z-10">
          <div className="text-center space-y-3 mb-12">
            <span className="text-[#0058be] text-xs font-bold uppercase tracking-widest bg-[#0058be]/10 px-3 py-1 rounded-md inline-block">
              F.A.Q Section
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#00236f] tracking-tight">
              پرسش‌های متداول کاربران
            </h2>
            <p className="text-[#475569] text-sm font-medium">
              پاسخ سریع به رایج‌ترین سوالات شما
            </p>
          </div>

          {/* Symmetrical Accordion Interface Container */}
          <div className="space-y-4">
            {faqData.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-[#0058be]/10 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_4px_15px_rgba(0,88,190,0.02)]"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-right bg-white hover:bg-[#f0f7ff]/40 transition-colors duration-200"
                  >
                    <span className="font-extrabold text-sm md:text-base text-[#00236f] leading-snug">
                      {item.question}
                    </span>
                    <ChevronIcon isOpen={isOpen} />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen
                        ? "max-h-[200px] border-t border-[#0058be]/5"
                        : "max-h-0"
                    }`}
                  >
                    <div className="px-6 py-5 bg-[#fafcfe]">
                      <p className="text-xs md:text-sm text-[#475569] leading-relaxed font-medium">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Light & Vibrant Final Call to Action */}
      <section className="w-full py-20 bg-white overflow-hidden">
        <div className="w-full px-4 md:px-8 max-w-4xl mx-auto text-center space-y-6 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#00236f] tracking-tight">
            نیاز به مشاوره فنی یا تخصصی بیشتری دارید؟
          </h2>
          <p className="text-[#475569] font-medium text-sm md:text-base max-w-xl leading-relaxed">
            اگر سوال شما در بخش پرسش‌های متداول وجود نداشت، متخصصان مجرب
            پشتیبانی فنی ما آماده راهنمایی تلفنی شما هستند.
          </p>
          <div className="pt-2">
            <a
              href="tel:02112345678"
              className="inline-flex items-center justify-center gap-3 bg-[#0058be] text-white font-bold text-sm px-10 py-4 rounded-xl shadow-lg hover:bg-[#0058be]/90 hover:shadow-[0_8px_25px_rgba(0,88,190,0.3)] active:scale-[0.98] transition-all duration-300"
            >
              تماس فوری با پشتیبانی فنی
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
