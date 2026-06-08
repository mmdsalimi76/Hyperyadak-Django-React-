// src/components/Checkout/PaymentFailure.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentFailure = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const reason =
    state?.reason || "عملیات پرداخت توسط کاربر لغو شد یا با خطا مواجه گردید.";

  return (
    <div className="w-full text-right" dir="rtl">
      {/* 100% Screen Full-Width Deep Corporate Blue Hero Header */}
      <div className="w-full bg-[#00236f] py-10 md:py-12 mb-10 text-center relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(30deg,#0058be_12%,transparent_12.1%),linear-gradient(150deg,#0058be_12%,transparent_12.1%)] bg-[size:32px_32px]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            وضعیت تراکنش مالی
          </h1>
        </div>
      </div>

      {/* Main Container Workspace */}
      <div className="max-w-7xl mx-auto px-4 pb-24 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xs flex flex-col items-center text-center">
            {/* Soft Alert Error Visual Badge */}
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-5 relative">
              <div className="absolute inset-0 border-4 border-rose-500/10 rounded-2xl animate-ping opacity-25"></div>
              <svg
                className="w-6 h-6 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h2 className="text-sm font-black text-rose-950 mb-3">
              تراکنش بانکی ناموفق بود
            </h2>

            {/* Dynamic Failure Message Block */}
            <div className="bg-rose-50/50 border border-rose-100/30 rounded-xl px-4 py-3.5 text-[11px] font-bold text-rose-700 leading-relaxed w-full mb-8">
              {reason}
            </div>

            {/* Strategic Call to Action Workspace Panel */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                onClick={() => navigate("/cart")}
                className="bg-[#0058be] hover:bg-[#00236f] text-white text-[11px] font-bold py-3 px-4 rounded-xl shadow-2xs hover:shadow-xs transition-all duration-150 text-center"
              >
                بازگشت و تلاش مجدد
              </button>

              <button
                onClick={() => navigate("/")}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 text-[11px] font-bold py-3 px-4 rounded-xl transition-colors text-center"
              >
                صفحه اصلی فروشگاه
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
