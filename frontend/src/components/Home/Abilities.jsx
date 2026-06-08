import React from "react";

// Custom precision SVGs
const FastDeliveryIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const AuthenticityIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const SecurePaymentIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const Support247Icon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const abilities = [
  {
    icon: <FastDeliveryIcon />,
    title: "ارسال اکسپرس و سریع",
    desc: "تحویل در کوتاه‌ترین زمان ممکن به سراسر کشور",
  },
  {
    icon: <AuthenticityIcon />,
    title: "ضمانت قطعی اصالت",
    desc: "تضمین صد درصدی اصالت کالا و قطعات اورجینال",
  },
  {
    icon: <SecurePaymentIcon />,
    title: "پرداخت هوشمند و امن",
    desc: "اتصال به درگاه‌های بانکی معتبر و رمزنگاری شده",
  },
  {
    icon: <Support247Icon />,
    title: "پشتیبانی تخصصی ۲۴/۷",
    desc: "مشاوره فنی رایگان پیش از خرید قطعه",
  },
];

function Abilities() {
  return (
    <section className="w-full py-12 bg-[#f9f9ff] overflow-hidden">
      {/* Edge-aligned responsive full-width view grid container */}
      <div className="w-full px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Mapping capabilities into distinct tactical instrumentation blocks */}
        {abilities.map((item, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-[#516ec4] to-[#170667] border-[#0058be]/10 shadow-[0_12px_35px_-10px_rgba(0,0,0,0.05)] group hover:-translate-y-1 hover:border-[#0058be]/40 transition-all duration-400 ease-out flex flex-col items-center text-center space-y-4"
          >
            {/* Dynamic ambient highlight leak hidden behind the active icon cell */}
            <div className="absolute -right-10 -top-10 w-24 h-24 bg-[#0058be]/5 rounded-full blur-2xl group-hover:bg-[#0058be]/15 transition-all duration-500 pointer-events-none" />

            {/* Icon Chassis Box */}
            <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#dde2e8] group-hover:bg-[#0058be] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-inner">
              {item.icon}
            </div>

            {/* Typography Stack Layout */}
            <div className="space-y-1.5 w-full">
              <h4 className="font-extrabold text-white text-base tracking-wide group-hover:text-[#0058be] transition-colors duration-300">
                {item.title}
              </h4>
              <p className="text-white/60 text-xs font-medium leading-relaxed max-w-[240px] mx-auto">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Abilities;
