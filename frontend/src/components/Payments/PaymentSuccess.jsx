// src/components/Checkout/PaymentSuccess.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const paymentId = state?.paymentId;

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
            {/* Emerald Check Success Animation Visual Badge */}
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-5 relative">
              <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-2xl animate-ping opacity-25"></div>
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
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-sm font-black text-emerald-950 mb-1.5">
              تراکنش مالی با موفقیت تایید شد
            </h2>
            <p className="text-[11px] font-bold text-gray-400 mb-6">
              سفارش شما با موفقیت ثبت گردید و وارد مرحله پردازش لجستیک انبار شد.
            </p>

            {/* Document Verification Invoice Card */}
            {paymentId && (
              <div className="w-full bg-gray-50 border border-gray-100/70 rounded-xl px-4 py-3.5 flex justify-between items-center mb-8">
                <span className="text-[11px] font-bold text-gray-400">
                  شناسه دیجیتال پرداخت:
                </span>
                <span className="font-mono font-black text-xs text-gray-700 tracking-wide">
                  {paymentId.toLocaleString("en-US")}
                </span>
              </div>
            )}

            {/* Balanced Single Action Control Wrapper */}
            <div className="w-full">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-[#0058be] hover:bg-[#00236f] text-white text-[11px] font-bold py-3 px-6 rounded-xl shadow-2xs hover:shadow-xs transition-all duration-150 text-center block"
              >
                بازگشت به صفحه اصلی
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
