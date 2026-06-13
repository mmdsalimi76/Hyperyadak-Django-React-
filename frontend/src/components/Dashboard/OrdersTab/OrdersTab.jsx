// src/components/Dashboard/OrdersTab.jsx
import React, { useState } from "react";
import {
  formatPrice,
  getStatusText,
  getStatusBadge,
  formatDate,
} from "../Utils/dashboardUtils.js";

function OrdersTab({ orders, onPayOrder, onCancelOrder }) {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleAction = async (actionFn, orderId) => {
    setProcessingId(orderId);
    try {
      await actionFn(orderId);
    } catch (error) {
      console.error("Action execution failed:", error);
    } finally {
      setProcessingId(null);
    }
  };

  // 1. Empty State Framework
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn bg-white border border-gray-100 rounded-2xl p-6">
        <div className="w-20 h-20 bg-[#0058be]/5 rounded-2xl flex items-center justify-center mb-5 text-[#0058be]">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h4 className="text-base font-black text-[#00236f] mb-1">
          هیچ سفارشی یافت نشد
        </h4>
        <p className="text-xs font-semibold text-[#475569]">
          تاریخچه تراکنش‌ها و سفارش‌های جاری شما در این بخش نمایش داده می‌شوند.
        </p>
      </div>
    );
  }

  // 2. Populated Order Hub Layout
  return (
    <div className="space-y-4 text-right">
      {orders.slice(0, 10).map((order) => {
        const isExpanded = expandedOrderId === order.id;
        const isCurrentProcessing = processingId === order.id;

        return (
          <div
            key={order.id}
            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
              isExpanded
                ? "border-[#0058be]/20 shadow-md ring-4 ring-[#0058be]/5"
                : "border-gray-100 hover:border-gray-200 shadow-sm"
            }`}
          >
            {/* Core Header Ledger Component */}
            <div className="p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#00236f]/5 rounded-xl flex items-center justify-center text-[#00236f] shrink-0">
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
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-sm text-[#1e293b]">
                      سفارش{" "}
                      <span className="font-mono tracking-wider text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                        #{order.order_number}
                      </span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[#475569]">
                      <span className="flex items-center gap-1">
                        <span className="text-gray-300">📆</span>{" "}
                        {formatDate(order.created_date)}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1 text-[#00236f]">
                        <span className="text-gray-400">مبلغ:</span>{" "}
                        {formatPrice(order.total_amount)} تومان
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badging & Interactive State Triggers */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0">
                  <span
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wide uppercase ${getStatusBadge(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </span>

                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="text-xs font-bold text-[#0058be] hover:bg-[#0058be]/5 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
                  >
                    <span>{isExpanded ? "بستن جزئیات" : "مشاهده جزئیات"}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
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
                  </button>
                </div>
              </div>

              {/* Postal Tracking Sub-Module Inline */}
              {order.tracking_code && (
                <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex items-center gap-2 text-xs font-semibold text-[#475569]">
                  <span className="text-gray-400">کد رهگیری مرسوله پستی:</span>
                  <a
                    href={`https://tracking.post.ir/?id=${order.tracking_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0058be] hover:underline font-mono tracking-wider font-bold inline-flex items-center gap-1 bg-[#0058be]/5 px-2 py-0.5 rounded"
                  >
                    {order.tracking_code}
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M10 6H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              )}
            </div>

            {/* Collapsible Panel Module */}
            {isExpanded && (
              <div className="border-t border-gray-100 bg-gray-50/60 p-5 md:p-6 space-y-5 animate-slideDown">
                {/* Structural Items List */}
                <div>
                  <h4 className="text-xs font-black text-[#00236f] mb-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#0058be]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    اقلام سفارش داده شده
                  </h4>
                  <div className="space-y-2">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center py-3 px-4 bg-white border border-gray-100 rounded-xl shadow-xs"
                        >
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-[#1e293b]">
                              {item.product_name}
                            </p>
                            <p className="text-[11px] font-semibold text-gray-400">
                              تعداد:{" "}
                              <span className="font-mono text-gray-600">
                                {item.quantity}
                              </span>{" "}
                              عدد
                            </p>
                          </div>
                          <p className="text-xs font-extrabold text-[#00236f]">
                            {formatPrice(item.total_price)} تومان
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs font-semibold text-gray-400 bg-white border border-gray-100 rounded-xl p-3 text-center">
                        جزییات اقلام این تراکنش موجود نمی‌باشد.
                      </p>
                    )}
                  </div>
                </div>

                {/* Concrete Shipping Details Integration */}
                {order.address && (
                  <div>
                    <h4 className="text-xs font-black text-[#00236f] mb-2 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-[#0058be]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      آدرس و نشانی تحویل مرسوله
                    </h4>
                    <div className="text-xs font-semibold text-[#475569] bg-white border border-gray-100 p-3.5 rounded-xl shadow-xs leading-relaxed">
                      <span>
                        {order.address.state}، {order.address.city}،{" "}
                        {order.address.full_address}
                      </span>
                      {order.address.postal_code && (
                        <div className="mt-1.5 pt-1.5 border-t border-gray-50 text-[11px] text-gray-400">
                          کد پستی مربوطه:{" "}
                          <span className="font-mono font-bold tracking-wider text-gray-600">
                            {order.address.postal_code}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Process Execution Gateway Controls (Pending State Status Block Only) */}
                {order.status === "pending" && (
                  <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-200/60">
                    <button
                      disabled={isCurrentProcessing}
                      onClick={() => handleAction(onCancelOrder, order.id)}
                      className="px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-40"
                    >
                      لغو سفارش
                    </button>

                    <button
                      disabled={isCurrentProcessing}
                      onClick={() => handleAction(onPayOrder, order.id)}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-40 flex items-center gap-1.5 rounded-xl"
                    >
                      {isCurrentProcessing ? (
                        <>
                          <svg
                            className="animate-spin h-3.5 w-3.5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>در حال اتصال...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>تکمیل و پرداخت آنلاین</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default OrdersTab;
