// src/components/Checkout/PaymentCallback.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const queryParams = new URLSearchParams(location.search);
      const Authority = queryParams.get("Authority");
      const Status = queryParams.get("Status");

      if (!Authority) {
        setStatus("error");
        setDetail("پارامتر توکن مرجع (Authority) بانکی معتبر یافت نشد.");
        return;
      }

      try {
        const response = await api.get(
          `/payments/api/v1/verify/?Authority=${Authority}&Status=${Status}`,
        );
        const data = response.data;

        if (data.status === "PAID") {
          navigate("/payments/success", {
            state: { paymentId: data.payment_id },
          });
        } else if (data.status === "CANCELED") {
          navigate("/payments/failure", {
            state: { reason: "عملیات پرداخت توسط کاربر لغو گردید." },
          });
        } else {
          navigate("/payments/failure", {
            state: { reason: data.detail || "پرداخت توسط بانک تایید نگردید." },
          });
        }
      } catch (error) {
        setStatus("error");
        const fallbackMessage =
          error.response?.data?.detail ||
          error.message ||
          "خطای غیرمنتظره در تایید فاکتور";
        setDetail(fallbackMessage);
      }
    };

    verifyPayment();
  }, [location.search, navigate]);

  return (
    <div className="w-full text-right" dir="rtl">
      {/* 100% Screen Full-Width Deep Corporate Blue Hero Header */}
      <div className="w-full bg-[#00236f] py-10 md:py-12 mb-10 text-center relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(30deg,#0058be_12%,transparent_12.1%),linear-gradient(150deg,#0058be_12%,transparent_12.1%)] bg-[size:32px_32px]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            سیستم تایید تراکنش بانکی
          </h1>
        </div>
      </div>

      {/* Main Status Display Area */}
      <div className="max-w-7xl mx-auto px-4 pb-24 flex items-center justify-center">
        <div className="max-w-md w-full">
          {/* State Indicator A: Processing State Loader */}
          {status === "loading" && (
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 relative flex items-center justify-center mb-5">
                {/* Visual ripple layer */}
                <div className="absolute inset-0 border-4 border-[#0058be]/20 rounded-full animate-ping opacity-25"></div>
                <div className="w-10 h-10 border-[3px] border-[#0058be]/10 border-t-[#0058be] rounded-full animate-spin"></div>
              </div>
              <h2 className="text-xs font-black text-[#1e293b] mb-1.5">
                در حال استعلام وضعیت پرداخت فاکتور...
              </h2>
              <p className="text-[10px] font-bold text-gray-400">
                لطفاً چند لحظه منتظر بمانید و از بستن یا بارگذاری مجدد این صفحه
                خودداری فرمایید.
              </p>
            </div>
          )}

          {/* State Indicator B: System Validation Error Frame */}
          {status === "error" && (
            <div className="bg-white border border-rose-100 rounded-3xl p-8 shadow-xs flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h2 className="text-xs font-black text-rose-900 mb-2">
                تایید تراکنش با خطا مواجه شد
              </h2>

              <div className="bg-rose-50/50 border border-rose-100/30 rounded-xl px-4 py-3 text-[11px] font-bold text-rose-700 leading-relaxed w-full mb-6">
                {detail}
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => navigate("/cart")}
                  className="bg-gray-900 hover:bg-gray-800 text-white text-[11px] font-bold py-2.5 px-4 rounded-xl transition-colors text-center"
                >
                  مشاهده سبد خرید
                </button>
                <button
                  onClick={() => navigate("/all-products")}
                  className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 text-[11px] font-bold py-2.5 px-4 rounded-xl transition-colors text-center"
                >
                  کاتالوگ قطعات
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
