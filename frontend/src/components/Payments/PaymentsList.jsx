// src/components/Checkout/PaymentsList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentsList = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const resp = await fetch("/payments/api/v1/list/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(
            data.detail || "خطا در دریافت تاریخچه تراکنش‌ها از سرور",
          );
        }
        setPayments(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Helper mapping function to handle dynamic status badge themes
  const getStatusConfig = (statusStr) => {
    const normalized = statusStr?.toUpperCase() || "";
    switch (normalized) {
      case "PAID":
      case "SUCCESS":
        return {
          text: "موفق",
          style: "bg-emerald-50 text-emerald-700 border-emerald-100",
        };
      case "PENDING":
        return {
          text: "در انتظار پرداخت",
          style: "bg-amber-50 text-amber-700 border-amber-100",
        };
      case "CANCELED":
      case "FAILED":
        return {
          text: "ناموفق / لغو شده",
          style: "bg-rose-50 text-rose-700 border-rose-100",
        };
      default:
        return {
          text: statusStr,
          style: "bg-gray-50 text-gray-600 border-gray-100",
        };
    }
  };

  if (loading) {
    return (
      <div className="w-full text-right" dir="rtl">
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-gray-100 rounded-2xl max-w-7xl mx-auto my-8">
          <div className="w-10 h-10 border-[3px] border-[#0058be]/10 border-t-[#0058be] rounded-full animate-spin"></div>
          <p className="mt-4 text-xs font-bold text-[#475569]">
            در حال فراخوانی سوابق مالی و تراکنش‌ها...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-right" dir="rtl">
        <div className="max-w-md mx-auto px-4 my-16 text-center">
          <div className="bg-white border border-rose-100 rounded-3xl p-8 shadow-xs flex flex-col items-center">
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
            <h2 className="text-sm font-black text-rose-900 mb-2">
              خطا در بارگذاری اطلاعات مالی
            </h2>
            <p className="text-[11px] font-bold text-rose-600/80 mb-6 leading-relaxed">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-3 px-6 rounded-xl transition-colors text-center"
            >
              تلاش مجدد ارتباط با سرور
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-right" dir="rtl">
      {/* 100% Screen Full-Width Deep Corporate Blue Hero Header */}
      <div className="w-full bg-[#00236f] py-10 md:py-12 mb-10 text-center relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(30deg,#0058be_12%,transparent_12.1%),linear-gradient(150deg,#0058be_12%,transparent_12.1%)] bg-[size:32px_32px]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#0058be] rounded-full hidden md:block" />
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              سوابق تراکنش‌ها و پرداخت‌های مالی
            </h1>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full border border-white/10">
            <span className="text-[10px] font-bold text-blue-200">
              مجموع کل قبوض:
            </span>
            <span className="text-xs font-mono font-black text-white">
              {payments.length?.toLocaleString("en-US")}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        {payments.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 mx-auto mb-4">
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
                  strokeWidth="1.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-xs font-black text-[#1e293b] mb-1">
              هیچ سابقه پرداختی یافت نشد
            </h3>
            <p className="text-[10px] font-bold text-gray-400 mb-6">
              تاکنون هیچ فاکتور یا پرداختی در حساب کاربری شما ثبت نشده است.
            </p>
            <button
              onClick={() => navigate("/all-products")}
              className="bg-[#0058be] text-white text-xs font-bold py-2.5 px-5 rounded-xl text-center hover:bg-[#00236f] transition-colors"
            >
              مشاهده کاتالوگ قطعات
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-2xs overflow-hidden">
            {/* Desktop View Table Interface */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-right">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-black text-[#475569]">
                    <th className="py-4 px-5">شناسه پرداخت</th>
                    <th className="py-4 px-5">شماره فاکتور سیستم</th>
                    <th className="py-4 px-5">تاریخ تراکنش</th>
                    <th className="py-4 px-5">وضعیت سند</th>
                    <th className="py-4 px-5 text-left">مبلغ پرداختی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs text-[#1e293b] font-bold">
                  {payments.map((p) => {
                    const statusConfig = getStatusConfig(p.status);
                    {
                      /* Fixed logic: ensure it dynamically prints western comma notation as Tomans */
                    }
                    const displayAmount = p.amount
                      ? p.amount.toLocaleString("en-US")
                      : "0";

                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-gray-50/40 transition-colors"
                      >
                        <td className="py-4 px-5 font-mono font-black text-gray-400 text-[11px]">
                          #{p.id}
                        </td>
                        <td className="py-4 px-5 font-mono font-black text-[#00236f]">
                          {p.order_number || "---"}
                        </td>
                        <td className="py-4 px-5 font-mono text-[#334155]">
                          {p.created_at
                            ? new Date(p.created_at).toLocaleDateString("fa-IR")
                            : "---"}
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-md border text-[10px] font-black ${statusConfig.style}`}
                          >
                            {statusConfig.text}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-left font-mono font-black text-[#0058be] text-sm">
                          {displayAmount}{" "}
                          <span className="text-[10px] font-sans font-bold text-gray-400 mr-0.5">
                            تومان
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Adaptive Lists Framework Screen Component Layout */}
            <div className="md:hidden divide-y divide-gray-100">
              {payments.map((p) => {
                const statusConfig = getStatusConfig(p.status);
                const displayAmount = p.amount
                  ? p.amount.toLocaleString("en-US")
                  : "0";

                return (
                  <div key={p.id} className="p-4 flex flex-col gap-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] font-black text-gray-400">
                        شناسه تراکنش: #{p.id}
                      </span>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md border text-[9px] font-black ${statusConfig.style}`}
                      >
                        {statusConfig.text}
                      </span>
                    </div>

                    <div className="flex justify-between items-center font-bold">
                      <span className="text-gray-400 text-[11px]">
                        شماره سفارش مرجع:
                      </span>
                      <span className="font-mono font-black text-[#00236f]">
                        {p.order_number || "---"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center font-bold">
                      <span className="text-gray-400 text-[11px]">
                        تاریخ ثبت سیستم:
                      </span>
                      <span className="font-mono text-gray-600">
                        {p.created_at
                          ? new Date(p.created_at).toLocaleDateString("fa-IR")
                          : "---"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-1">
                      <span className="text-gray-900 font-black">
                        مبلغ تراکنش:
                      </span>
                      <span className="font-mono font-black text-sm text-[#0058be]">
                        {displayAmount}{" "}
                        <span className="text-[10px] font-sans font-bold text-gray-400 mr-0.5">
                          تومان
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsList;
