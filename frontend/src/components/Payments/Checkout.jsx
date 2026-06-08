// src/components/Checkout/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../../services/api";

// Helper: convert English number to Persian digits with thousands separators
const toPersianNumber = (num) => {
  if (num === undefined || num === null) return "";
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const convert = (str) =>
    str.replace(/\d/g, (d) => persianDigits[parseInt(d)]);
  if (parts.length === 1) return convert(parts[0]);
  return convert(parts[0]) + "." + convert(parts[1]);
};

const useQuery = () => new URLSearchParams(useLocation().search);

const Checkout = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const orderId = query.get("order_id") || null;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setFetchError("شناسه معتبر برای سفارش یافت نشد.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/accounts/api/v1/orders/${orderId}/`);
        setOrder(response.data);
      } catch (error) {
        setFetchError(error.message || "خطا در دریافت اطلاعات فاکتور سفارش");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePay = async () => {
    setPaying(true);
    setPayError(null);

    try {
      const response = await api.post("/payments/api/v1/create/", {
        order_id: order.order_number,
        amount: parseInt(order.total_amount) * 10,
      });

      const data = response.data;
      window.location.href = data.payment_url;
    } catch (error) {
      setPayError(error.message || "اتصال به درگاه پرداخت با خطا مواجه شد.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full text-right" dir="rtl">
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-gray-100 rounded-2xl max-w-7xl mx-auto my-8">
          <div className="w-10 h-10 border-[3px] border-[#0058be]/10 border-t-[#0058be] rounded-full animate-spin"></div>
          <p className="mt-4 text-xs font-bold text-[#475569]">
            در حال فراخوانی جزئیات سفارش...
          </p>
        </div>
      </div>
    );
  }

  if (fetchError || !order) {
    return (
      <div className="w-full text-right" dir="rtl">
        <div className="w-full bg-gray-50/50 border-b border-gray-100 py-8 mb-12">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-rose-500 rounded-full" />
            <h1 className="text-sm font-black text-rose-950">
              بروز خطا در سیستم
            </h1>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 mb-24 text-center">
          <div className="bg-white border border-rose-100 rounded-3xl p-8 shadow-xs flex flex-col items-center">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-4">
              <svg
                className="w-8 h-8"
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
              {fetchError || "سفارش مورد نظر معتبر نیست"}
            </h2>
            <p className="text-[11px] font-bold text-gray-400 mb-6">
              امکان بارگذاری فاکتور وجود ندارد. ممکن است لینک منقضی شده باشد.
            </p>
            <button
              onClick={() => navigate("/cart")}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-3 px-6 rounded-xl transition-colors text-center"
            >
              بازگشت به سبد خرید
            </button>
          </div>
        </div>
      </div>
    );
  }

  const address = order.address;
  const items = order.items || [];
  const totalItemCount = items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  return (
    <div className="w-full text-right" dir="rtl">
      {/* 100% Screen Full-Width Deep Corporate Blue Hero Header */}
      <div className="w-full bg-[#00236f] py-10 md:py-12 mb-10 text-center relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(30deg,#0058be_12%,transparent_12.1%),linear-gradient(150deg,#0058be_12%,transparent_12.1%)] bg-[size:32px_32px]"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#0058be] rounded-full hidden md:block" />
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              بررسی و تایید نهایی سفارش
            </h1>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full border border-white/10">
            <span className="text-[10px] font-bold text-blue-200">
              وضعیت سند:
            </span>
            <span className="text-xs font-bold text-white">
              {order.status === "pending"
                ? "در انتظار پرداخت بانکی"
                : order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Main Structural Core Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Container Work Area (Left Grid) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Core General Invoice Details */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                <div className="w-1 h-3.5 bg-[#0058be] rounded-full" />
                <h2 className="text-xs font-black text-[#00236f]">
                  مشخصات فاکتور سیستم
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between items-center bg-gray-50/50 border border-gray-100/30 rounded-xl px-4 py-3">
                  <span className="text-[11px] font-bold text-gray-400">
                    شماره ارجاع سفارش:
                  </span>
                  <span className="font-mono font-black text-xs text-[#1e293b]">
                    {order.order_number}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-gray-50/50 border border-gray-100/30 rounded-xl px-4 py-3">
                  <span className="text-[11px] font-bold text-gray-400">
                    تاریخ ثبت فاکتور:
                  </span>
                  <span className="font-mono font-black text-xs text-[#1e293b]">
                    {new Date(order.created_date).toLocaleDateString("fa-IR")}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Breakdown Itemization Canvas */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                <div className="w-1 h-3.5 bg-[#0058be] rounded-full" />
                <h2 className="text-xs font-black text-[#00236f]">
                  لیست قطعات و ملزومات سفارشی
                </h2>
              </div>

              {items.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-xs text-[#1e293b] line-clamp-1 mb-1">
                          {item.product_name}
                        </h3>
                        <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 font-mono text-[10px] font-black px-2 py-0.5 rounded-md">
                          <span>{toPersianNumber(item.quantity)}</span>
                          <span className="font-sans font-bold text-[9px]">
                            عدد
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-gray-50/50 pt-2 sm:pt-0">
                        <div className="text-right sm:text-left">
                          <p className="text-[10px] font-mono font-bold text-gray-400">
                            {toPersianNumber(item.unit_price)} ×{" "}
                            {toPersianNumber(item.quantity)}
                          </p>
                          <p className="font-mono font-black text-xs text-[#00236f] mt-0.5">
                            {toPersianNumber(item.total_price)}{" "}
                            <span className="text-[10px] font-sans font-bold text-gray-400">
                              تومان
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-bold text-gray-400 text-center py-6">
                  هیچ قطعه‌ای در ساختار این سفارش یافت نشد.
                </p>
              )}
            </div>

            {/* 3. Shipping Logistics Frame */}
            {address && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-3.5">
                  <div className="w-1 h-3.5 bg-[#0058be] rounded-full" />
                  <h2 className="text-xs font-black text-[#00236f]">
                    اطلاعات و محل تحویل مرسوله
                  </h2>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-gray-50 border border-gray-100/50 rounded-xl p-3.5 text-[#334155] leading-relaxed font-bold">
                    {address.full_address}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-bold text-gray-500">
                    <div className="bg-gray-50/50 border border-gray-100 rounded-lg px-3 py-2">
                      <span className="text-gray-400 ml-1">استان مقصد:</span>
                      <span className="text-[#1e293b] font-black">
                        {address.state}
                      </span>
                    </div>
                    <div className="bg-gray-50/50 border border-gray-100 rounded-lg px-3 py-2">
                      <span className="text-gray-400 ml-1">شهر خریدار:</span>
                      <span className="text-[#1e293b] font-black">
                        {address.city}
                      </span>
                    </div>
                    <div className="bg-gray-50/50 border border-gray-100 rounded-lg px-3 py-2">
                      <span className="text-gray-400 ml-1">
                        کد پستی مرسوله:
                      </span>
                      <span className="text-[#1e293b] font-mono font-black">
                        {address.postal_code}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Statement Calculations Panel (Right Grid Layout) */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-xs p-5 sticky top-24">
              <h2 className="text-xs font-black text-[#00236f] border-b border-gray-100 pb-3.5 mb-4">
                خلاصه وضعیت مالی فاکتور
              </h2>

              <div className="space-y-3.5 pb-4 border-b border-gray-50">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#475569]">
                    مجموع اقلام فاکتور:
                  </span>
                  <span className="font-mono font-black text-[#1e293b] bg-gray-50 px-2.5 py-0.5 rounded-md border border-gray-100/50">
                    {toPersianNumber(totalItemCount)} قلم
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#475569]">
                    بهای ناخالص قطعات:
                  </span>
                  <span className="font-mono font-black text-[#1e293b]">
                    {toPersianNumber(order.total_amount)}{" "}
                    <span className="text-[10px] font-sans font-bold text-gray-400">
                      تومان
                    </span>
                  </span>
                </div>
              </div>

              {/* Total Balance Amount */}
              <div className="flex justify-between items-center py-4 mb-4">
                <span className="text-xs font-black text-[#1e293b]">
                  مبلغ نهایی قابل تسویه:
                </span>
                <div className="text-left">
                  <span className="font-mono font-black text-lg text-[#0058be] tracking-tight">
                    {toPersianNumber(order.total_amount)}
                  </span>
                  <span className="text-[10px] font-black text-[#1e293b] mr-1">
                    تومان
                  </span>
                </div>
              </div>

              {/* Internal Error Callout */}
              {payError && (
                <div className="bg-rose-50 border border-rose-500/10 text-rose-700 text-[10px] font-bold p-3 rounded-xl mb-4 leading-relaxed">
                  {payError}
                </div>
              )}

              {/* Transaction Action Panel Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-3 rounded-xl font-bold text-xs shadow-2xs hover:shadow-xs transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {paying && (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  <span>
                    {paying
                      ? "در حال اتصال به شبکه شتاب..."
                      : "انتقال به درگاه امن بانکی"}
                  </span>
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-500 py-2.5 rounded-xl text-[11px] font-bold transition-colors"
                >
                  انصراف و ویرایش سبد خرید
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
