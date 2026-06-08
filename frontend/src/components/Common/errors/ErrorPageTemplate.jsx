import React from "react";
import { Link } from "react-router-dom";

const ErrorPageTemplate = ({
  code,
  title,
  message,
  actionLabel = "بازگشت به صفحه اصلی",
  actionTo = "/",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full text-center bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
        <div className="mb-6 inline-flex items-center justify-center h-20 w-20 rounded-full bg-[#0058be]/10 text-[#0058be] text-3xl font-black">
          {code}
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{title}</h1>
        <p className="text-sm text-gray-600 mb-8">{message}</p>
        <Link
          to={actionTo}
          className="inline-flex items-center justify-center rounded-full bg-[#0058be] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0042a8]"
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  );
};

export default ErrorPageTemplate;
