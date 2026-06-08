// src/components/Dashboard/AccountTab.jsx
import React from "react";

function AccountTab({
  profileForm,
  setProfileForm,
  phoneNumber,
  formLoading,
  formMessage,
  onSubmit,
}) {
  return (
    <div className="relative animate-fadeIn">
      <div className="space-y-6">
        {/* Section Corporate Header */}
        <div className="border-b border-[#0058be]/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-6 bg-[#0058be] rounded-full" />
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#00236f]">
              اطلاعات حساب کاربری
            </h2>
          </div>
          <p className="text-[#475569] text-xs font-medium mt-1.5 mr-3.5">
            مشخصات شخصی و هویتی خود را در سامانه مرکزی هایپر یدک مدیریت کنید
          </p>
        </div>

        {/* Form Notifications & Toast Zone */}
        {formMessage.text && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border text-xs font-semibold shadow-sm transition-all duration-300 animate-slideDown ${
              formMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div
              className={`p-1 rounded-lg shrink-0 ${
                formMessage.type === "success"
                  ? "bg-emerald-100/70"
                  : "bg-red-100/70"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {formMessage.type === "success" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
            </div>
            <span>{formMessage.text}</span>
          </div>
        )}

        {/* Operational Profile Form */}
        <form onSubmit={onSubmit} className="space-y-5 text-right">
          {/* Responsive Name Grid fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1">
                نام
              </label>
              <input
                type="text"
                value={profileForm.first_name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, first_name: e.target.value })
                }
                placeholder="مثال: علی"
                className="w-full px-4 py-3 bg-white border border-[#0058be]/15 focus:border-[#0058be] rounded-xl text-sm font-semibold text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[#0058be]/5 transition-all duration-200 placeholder-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1">
                نام خانوادگی
              </label>
              <input
                type="text"
                value={profileForm.last_name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, last_name: e.target.value })
                }
                placeholder="مثال: محمدی"
                className="w-full px-4 py-3 bg-white border border-[#0058be]/15 focus:border-[#0058be] rounded-xl text-sm font-semibold text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[#0058be]/5 transition-all duration-200 placeholder-gray-300 shadow-sm"
              />
            </div>
          </div>

          {/* Secure Locked Phone Node */}
          <div>
            <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1">
              شماره تلفن همراه
            </label>
            <input
              type="tel"
              value={phoneNumber}
              disabled
              dir="ltr"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200/70 rounded-xl text-sm font-bold text-[#475569] tracking-wider cursor-not-allowed text-left shadow-inner opacity-80"
            />
            <p className="text-xs font-medium text-[#475569] mt-2 mr-1 flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg inline-block">
              <svg
                className="w-3.5 h-3.5 text-[#0058be] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                شماره تلفن همراه هویت اصلی شماست؛ جهت ویرایش آن با پشتیبانی تماس
                بگیرید.
              </span>
            </p>
          </div>

          {/* Action Submission Control */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={formLoading}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0058be] text-white font-bold rounded-xl text-xs shadow-md hover:bg-[#0058be]/90 hover:shadow-[0_6px_20px_rgba(0,88,190,0.18)] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {formLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                  <span>در حال ذخیره اطلاعات...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
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
                  <span>ذخیره تغییرات پروفایل</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Styled Transition Frame Injection */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

export default AccountTab;
