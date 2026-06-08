import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { productAPI } from "../../services/api";
import Loader from "../Common/Loader/Loader";

function ProductComments({ productId }) {
  const { isAuthenticated, profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const commentsArray = await productAPI.getProductComments(productId);
      setComments(commentsArray);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("خطا در بارگذاری نظرات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchComments();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setSubmitMessage({ type: "error", text: "لطفاً متن نظر را وارد کنید." });
      return;
    }

    setSubmitting(true);
    setSubmitMessage(null);
    try {
      await productAPI.createProductComment(productId, newComment);
      setNewComment("");
      setSubmitMessage({
        type: "success",
        text: "نظر شما با موفقیت ثبت شد و پس از تأیید نمایش داده می‌شود.",
      });
      await fetchComments();
    } catch (err) {
      setSubmitMessage({
        type: "error",
        text: "خطا در ثبت نظر. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getUserDisplayName = (comment) => {
    if (comment.user_name) return comment.user_name;
    if (comment.user_phone) return comment.user_phone;
    return "کاربر";
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 bg-red-50 rounded-2xl">
        <p>{error}</p>
        <button
          onClick={fetchComments}
          className="mt-2 text-sm text-sky-600 hover:underline"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* Comment list */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">نظرات کاربران</h3>
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-2xl">
            <svg
              className="w-12 h-12 mx-auto text-gray-300 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p>هنوز نظری ثبت نشده است.</p>
            <p className="text-sm mt-1">اولین نفری باشید که نظر می‌دهد!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                {/* User Comment Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-sky-100 to-indigo-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-sky-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-800">
                        {getUserDisplayName(comment)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.created_date).toLocaleDateString(
                        "fa-IR",
                      )}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm mt-2">
                    {comment.text}
                  </p>
                </div>

                {/* Admin Reply Section (Checks comment.reply or comment.admin_reply) */}
                {(comment.reply || comment.admin_reply) && (
                  <div className="margin-inline-start-6 mr-8 bg-slate-50 border-r-4 border-sky-500 rounded-l-2xl rounded-r-sm p-4 shadow-inner relative">
                    {/* Tiny visual arrow linking reply to parent */}
                    <div className="absolute -top-3 right-4 w-3 h-3 bg-slate-50 border-t border-r border-gray-100 rotate-45 hidden md:block"></div>

                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-sky-600 rounded-full flex items-center justify-center shadow-sm">
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                        <span className="text-xs font-bold text-sky-800 bg-sky-100/80 px-2 py-0.5 rounded-md">
                          پاسخ مدیریت
                        </span>
                      </div>

                      {comment.reply_date && (
                        <span className="text-[10px] text-gray-400">
                          {new Date(comment.reply_date).toLocaleDateString(
                            "fa-IR",
                          )}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 leading-relaxed text-xs font-medium">
                      {comment.reply || comment.admin_reply}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add comment section */}
      <div className="border-t pt-6 relative">
        <h3 className="text-lg font-bold text-gray-800 mb-4">ثبت نظر جدید</h3>

        {submitMessage && (
          <div
            className={`mb-4 p-3 rounded-xl text-sm ${
              submitMessage.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        {/* Blur wrapper */}
        <div
          className={`transition-all duration-300 ${
            !isAuthenticated
              ? "filter blur-[2px] pointer-events-none select-none"
              : ""
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="4"
              placeholder="نظر خود را بنویسید..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              required
              disabled={!isAuthenticated}
            />
            <button
              type="submit"
              disabled={submitting || !isAuthenticated}
              className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  <span>در حال ثبت...</span>
                </>
              ) : (
                "ارسال نظر"
              )}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3">
            نظرات پس از تأیید مدیر نمایش داده می‌شوند.
          </p>
        </div>

        {/* Overlay for unauthenticated users */}
        {!isAuthenticated && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl">
            <div className="text-center p-6 bg-white/90 rounded-2xl shadow-lg max-w-xs mx-auto">
              <svg
                className="w-12 h-12 mx-auto text-sky-600 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <p className="text-gray-700 font-medium mb-2">
                برای ثبت نظر وارد حساب خود شوید
              </p>
              <Link
                to="/login"
                className="inline-block mt-2 text-sky-600 hover:text-sky-700 font-semibold"
              >
                ورود / ثبت‌نام
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductComments;
