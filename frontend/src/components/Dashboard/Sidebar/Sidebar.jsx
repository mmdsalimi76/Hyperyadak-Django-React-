// src/components/Dashboard/Sidebar.jsx
import React from "react";

function Sidebar({
  displayName,
  phoneNumber,
  currentTab,
  onTabChange,
  onLogout,
}) {
  const tabs = [
    {
      id: "orders",
      label: "سفارش‌های من",
      icon: (
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      id: "addresses",
      label: "آدرس‌های من",
      icon: (
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      id: "tickets",
      label: "پشتیبانی تیکت‌ها",
      icon: (
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
      ),
    },
    {
      id: "password",
      label: "تغییر رمز عبور",
      icon: (
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
            d="M12 15v2m-6 4h12a2 2 0 002-2v-12a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm10-10a4 4 0 00-8 0v4a4 4 0 008 0v-4z"
          />
        </svg>
      ),
    },
    {
      id: "account",
      label: "اطلاعات حساب",
      icon: (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="lg:col-span-1 space-y-4 text-right">
      {/* Profile Card Summary Context */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        <div className="relative inline-block mt-2">
          {/* Flat deep tone placeholder box */}
          <div className="w-20 h-20 bg-[#00236f]/5 border border-[#00236f]/10 rounded-full flex items-center justify-center text-[#00236f]">
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
                strokeWidth="1.8"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          {/* Solid verification badge status marker */}
          <div className="absolute bottom-0 right-0 bg-emerald-600 rounded-full p-1 border-2 border-white shadow-xs">
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h3 className="font-black text-base text-[#00236f] mt-3.5 tracking-tight">
          {displayName}
        </h3>
        <p className="text-xs font-mono font-bold text-gray-400 mt-1 direction-ltr select-all">
          {phoneNumber}
        </p>

        {/* Clean Corporate Secondary Border Action Box */}
        <button
          onClick={onLogout}
          className="mt-5 w-full bg-rose-50 hover:bg-rose-100/70 text-rose-700 border border-rose-200/40 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 group/btn"
        >
          <svg
            className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>خروج از حساب کاربری</span>
        </button>
      </div>

      {/* Navigation Ecosystem Tab Triggers */}
      <nav className="bg-white border border-gray-100 rounded-2xl p-2 shadow-sm space-y-1">
        {tabs.map((tab) => {
          const isSelected = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-150 ${
                isSelected
                  ? "bg-[#0058be] text-white shadow-xs"
                  : "bg-transparent text-[#475569] hover:bg-gray-50 hover:text-[#00236f]"
              }`}
            >
              <span
                className={`transition-colors shrink-0 ${isSelected ? "text-white" : "text-gray-400 group-hover:text-[#0058be]"}`}
              >
                {tab.icon}
              </span>
              <span className="flex-1 text-right tracking-tight">
                {tab.label}
              </span>

              {isSelected && (
                <svg
                  className="w-3.5 h-3.5 text-white transform transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M15 18l-6-6 6-6"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
