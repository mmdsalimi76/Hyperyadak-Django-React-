// src/components/Dashboard/TicketsTab/TicketsTab.jsx
import React, { useState, useEffect } from "react";
import { ticketAPI } from "../../../services/api";
import {
  formatDate,
  getTicketStatusText,
  getTicketStatusBadge,
} from "../Utils/dashboardUtils.js";

function TicketsTab() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Selected ticket for thread detail view
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState("");

  // Creation form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newFirstMessage, setNewFirstMessage] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ticketAPI.getTickets();
      const data = response.data;
      if (Array.isArray(data)) {
        setTickets(data);
      } else if (data && Array.isArray(data.results)) {
        setTickets(data.results);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.error(err);
      setError("خطا در بارگذاری لیست تیکت‌ها. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTicket = async (ticketId) => {
    setDetailLoading(true);
    setReplyError("");
    try {
      const response = await ticketAPI.getTicketDetails(ticketId);
      setSelectedTicket(response.data);
    } catch (err) {
      console.error(err);
      setReplyError("خطا در دریافت جزئیات تیکت.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setReplyLoading(true);
    setReplyError("");
    try {
      const response = await ticketAPI.replyTicket(
        selectedTicket.id,
        replyMessage.trim(),
      );
      setSelectedTicket((prev) => ({
        ...prev,
        status: "open",
        status_display: "باز",
        messages: [...(prev.messages || []), response.data],
      }));
      setReplyMessage("");
      fetchTickets();
    } catch (err) {
      console.error(err);
      setReplyError(
        err.response?.data?.detail ||
          "خطا در ارسال پاسخ. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setReplyLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFirstMessage.trim()) return;

    setCreateLoading(true);
    setCreateError("");
    try {
      const response = await ticketAPI.createTicket({
        title: newTitle.trim(),
        message: newFirstMessage.trim(),
      });
      await handleSelectTicket(response.data.id);
      setShowCreateForm(false);
      setNewTitle("");
      setNewFirstMessage("");
      fetchTickets();
    } catch (err) {
      console.error(err);
      setCreateError(
        err.response?.data?.message?.[0] ||
          err.response?.data?.title?.[0] ||
          "خطا در ایجاد تیکت جدید. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setCreateLoading(false);
    }
  };

  // Base Loading Spinner Module
  if (loading && tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-gray-100 rounded-2xl">
        <div className="w-10 h-10 border-[3px] border-[#0058be]/10 border-t-[#0058be] rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-[#475569]">
          در حال دریافت تیکت‌های پشتیبانی...
        </p>
      </div>
    );
  }

  // ================= VIEW: TICKET DETAILS (CONVERSATION THREAD) =================
  if (selectedTicket) {
    return (
      <div className="space-y-6 text-right bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm animate-fadeIn">
        {/* Detail View Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedTicket(null);
                setReplyMessage("");
                setReplyError("");
              }}
              className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl transition-all text-[#475569]"
              title="بازگشت به لیست تیکت‌ها"
            >
              <svg
                className="w-5 h-5 transform rotate-180 rtl:rotate-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <div>
              <h3 className="font-black text-base text-[#00236f]">
                {selectedTicket.title}
              </h3>
              <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
                شناسه تیکت:{" "}
                <span className="font-mono">#{selectedTicket.id}</span> • زمان
                ثبت: {formatDate(selectedTicket.created_date)}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-wide self-start sm:self-center uppercase ${getTicketStatusBadge(selectedTicket.status)}`}
          >
            {getTicketStatusText(selectedTicket.status)}
          </span>
        </div>

        {/* Messaging Logs Ecosystem */}
        <div className="bg-gray-50/40 border border-gray-100 rounded-2xl p-4 md:p-5 max-h-[480px] overflow-y-auto space-y-4">
          {detailLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-[3px] border-[#0058be]/10 border-t-[#0058be] rounded-full animate-spin"></div>
            </div>
          ) : (
            selectedTicket.messages?.map((msg) => {
              const isSupport = msg.is_support;
              return (
                <div
                  key={msg.id}
                  className={`w-full flex ${isSupport ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isSupport ? "items-start" : "items-end"}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span
                        className={`text-[11px] font-black ${isSupport ? "text-[#0058be]" : "text-[#00236f]"}`}
                      >
                        {msg.sender_name ||
                          (isSupport ? "پشتیبان سیستم" : "شما")}
                      </span>
                      <span className="text-[9px] font-semibold text-gray-400 font-mono">
                        {formatDate(msg.created_date)}
                      </span>
                    </div>
                    <div
                      className={`p-4 rounded-2xl text-xs font-semibold leading-relaxed whitespace-pre-line border shadow-xs ${
                        isSupport
                          ? "bg-white border-[#0058be]/10 text-[#1e293b] rounded-tr-none"
                          : "bg-[#00236f] border-[#00236f] text-white rounded-tl-none"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Dialogue Reply Actions Box */}
        {selectedTicket.status === "closed" ? (
          <div className="p-4 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl text-center text-xs font-bold">
            این تیکت پشتیبانی بسته شده و در حالت آرشیو قرار دارد. امکان ارسال
            پاسخ جدید میسر نیست.
          </div>
        ) : (
          <form onSubmit={handleSendReply} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1">
                ارسال پاسخ جدید
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="متن پیام خود را وارد نمایید..."
                rows="4"
                disabled={replyLoading}
                className="w-full px-4 py-3 bg-white border border-[#0058be]/15 focus:border-[#0058be] rounded-xl text-xs font-semibold text-[#1e293b] placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#0058be]/5 transition-all duration-200 resize-none"
              />
            </div>

            {replyError && (
              <p className="text-rose-600 text-[11px] font-bold mr-1">
                {replyError}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={replyLoading || !replyMessage.trim()}
                className="px-5 py-2.5 bg-[#0058be] text-white font-bold rounded-xl text-xs shadow-md hover:bg-[#0058be]/90 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                {replyLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>در حال ارسال...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3.5 h-3.5 transform -rotate-90 rtl:rotate-90"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    <span>ارسال پاسخ</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // ================= VIEW: CREATE NEW TICKET FORM =================
  if (showCreateForm) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm text-right animate-fadeIn space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#0058be] rounded-full" />
            <h3 className="text-base font-black text-[#00236f]">
              ایجاد تیکت پشتیبانی جدید
            </h3>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(false);
              setNewTitle("");
              setNewFirstMessage("");
              setCreateError("");
            }}
            className="text-xs font-bold text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors"
          >
            انصراف
          </button>
        </div>

        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1">
              موضوع / عنوان تیکت
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="مثال: سوال درباره نحوه تمدید دوره یا ابهام در فاکتور پرداخت"
              disabled={createLoading}
              className="w-full px-4 py-3 bg-white border border-[#0058be]/15 focus:border-[#0058be] rounded-xl text-xs font-semibold text-[#1e293b] placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#0058be]/5 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1">
              شرح کامل درخواست / متن پیام
            </label>
            <textarea
              value={newFirstMessage}
              onChange={(e) => setNewFirstMessage(e.target.value)}
              placeholder="لطفاً جزئیات و توضیحات تکمیلی خود را در این بخش با دقت وارد کنید..."
              rows="5"
              disabled={createLoading}
              className="w-full px-4 py-3 bg-white border border-[#0058be]/15 focus:border-[#0058be] rounded-xl text-xs font-semibold text-[#1e293b] placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#0058be]/5 transition-all duration-200 resize-none"
              required
            />
          </div>

          {createError && (
            <p className="text-rose-600 text-[11px] font-bold mr-1">
              {createError}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-50">
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setNewTitle("");
                setNewFirstMessage("");
                setCreateError("");
              }}
              className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-500 rounded-xl transition-colors"
            >
              لغو درخواست
            </button>
            <button
              type="submit"
              disabled={
                createLoading || !newTitle.trim() || !newFirstMessage.trim()
              }
              className="px-5 py-2.5 bg-[#0058be] text-white font-bold rounded-xl text-xs shadow-md hover:bg-[#0058be]/90 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 flex items-center gap-1.5"
            >
              {createLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>در حال ثبت...</span>
                </>
              ) : (
                "ثبت و ارسال تیکت"
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ================= VIEW: TICKET LIST =================
  return (
    <div className="space-y-4 text-right">
      {/* List Hub Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-black text-[#00236f]">
            تیکت‌های پشتیبانی
          </h3>
          <p className="text-[11px] font-semibold text-[#475569] mt-0.5">
            درخواست‌ها، سوالات و مشکلات خود را در این بخش پیگیری کنید
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2.5 bg-[#0058be] text-white font-bold rounded-xl text-xs shadow-md hover:bg-[#0058be]/90 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-1.5 self-start sm:self-center"
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>تیکت جدید</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-500/10 text-rose-700 text-xs font-bold rounded-xl animate-scaleUp">
          {error}
        </div>
      )}

      {/* Tickets Master Hub Canvas */}
      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="w-16 h-16 bg-[#0058be]/5 rounded-2xl flex items-center justify-center mb-4 text-[#0058be]">
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
                strokeWidth="1.5"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h4 className="text-sm font-black text-[#00236f] mb-1">
            هیچ تیکتی پشتیبانی یافت نشد
          </h4>
          <p className="text-xs font-semibold text-[#475569] mb-5">
            در صورت بروز هرگونه ابهام یا سوال در فرآیند خدمات، یک درخواست ارسال
            کنید.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-[#0058be] font-bold rounded-xl text-xs transition-all"
          >
            ارسال اولین تیکت پشتیبانی
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-2 md:p-3 shadow-sm divide-y divide-gray-50 overflow-hidden">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => handleSelectTicket(ticket.id)}
              className="flex items-center justify-between p-4 hover:bg-gray-50/70 rounded-xl cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#00236f]/5 text-[#00236f] border border-[#00236f]/5 flex items-center justify-center shrink-0 transition-transform group-hover:scale-102">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#1e293b] group-hover:text-[#0058be] transition-colors line-clamp-1">
                    {ticket.title}
                  </h4>
                  <p className="text-[10px] font-semibold text-gray-400">
                    آخرین بروزرسانی: {formatDate(ticket.updated_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-xl text-[9px] font-black tracking-wide uppercase ${getTicketStatusBadge(ticket.status)}`}
                >
                  {getTicketStatusText(ticket.status)}
                </span>
                <svg
                  className="w-4 h-4 text-gray-300 group-hover:text-[#475569] transition-all transform ltr:group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketsTab;
