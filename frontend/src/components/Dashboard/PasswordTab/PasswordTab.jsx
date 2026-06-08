// src/components/Dashboard/PasswordTab.jsx
import React from "react";

function PasswordTab({
  passwordData,
  setPasswordData,
  formLoading,
  formMessage,
  onSubmit,
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm text-right animate-fadeIn">
      {/* Tab Header Segment */}
      <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-[#0058be]/5">
        <div className="w-1 h-5 bg-[#0058be] rounded-full" />
        <h3 className="text-base font-black text-[#00236f]">
          تغییر رمز عبور حساب کاربری
        </h3>
      </div>

      {/* Dynamic Notification Context */}
      {formMessage.text && (
        <div
          className={`mb-5 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 border animate-scaleUp ${
            formMessage.type === "success"
              ? "bg-emerald-50 border-emerald-500/10 text-emerald-700"
              : "bg-rose-50 border-rose-500/10 text-rose-700"
          }`}
        >
          <span className="text-base">
            {formMessage.type === "success" ? "✓" : "✕"}
          </span>
          <p>{formMessage.text}</p>
        </div>
      )}

      {/* Form Input Ecosystem */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1">
            رمز عبور فعلی
          </label>
          <input
            type="password"
            value={passwordData.current_password}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                current_password: e.target.value,
              })
            }
            className="w-full px-4 py-3 bg-white border border-[#0058be]/15 focus:border-[#0058be] rounded-xl text-sm font-semibold text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[#0058be]/5 transition-all duration-200"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1">
              رمز عبور جدید
            </label>
            <input
              type="password"
              value={passwordData.new_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  new_password: e.target.value,
                })
              }
              className="w-full px-4 py-3 bg-white border border-[#0058be]/15 focus:border-[#0058be] rounded-xl text-sm font-semibold text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[#0058be]/5 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1">
              تکرار رمز عبور جدید
            </label>
            <input
              type="password"
              value={passwordData.confirm_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirm_password: e.target.value,
                })
              }
              className="w-full px-4 py-3 bg-white border border-[#0058be]/15 focus:border-[#0058be] rounded-xl text-sm font-semibold text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[#0058be]/5 transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Action Triggers */}
        <div className="pt-2 flex justify-start">
          <button
            type="submit"
            disabled={formLoading}
            className="px-6 py-3 bg-[#0058be] text-white font-bold rounded-xl text-xs shadow-md hover:bg-[#0058be]/90 hover:shadow-[0_4px_12px_rgba(0,88,190,0.15)] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            {formLoading ? (
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
                <span>در حال به‌روزرسانی...</span>
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>تغییر رمز عبور</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PasswordTab;
