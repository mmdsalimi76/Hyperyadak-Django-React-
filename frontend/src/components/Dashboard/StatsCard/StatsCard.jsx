// src/components/Dashboard/StatsCard.jsx
import React from "react";

function StatsCard({ title, value, icon: propIcon, color = "blue" }) {
  // Fallback icon determination if not explicitly passed
  const isActive = title?.includes("فعال");
  const fallbackIcon = isActive ? (
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
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ) : (
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
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const displayIcon = propIcon || fallbackIcon;

  // Clean corporate color variants targeting backgrounds and raw accents
  const colorMap = {
    blue: "bg-[#00236f]/5 text-[#00236f] border-[#00236f]/10",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-500/10",
    amber: "bg-amber-50 text-amber-600 border-amber-500/10",
    sky: "bg-[#0058be]/5 text-[#0058be] border-[#0058be]/10",
  };

  const currentStyle = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 text-right flex flex-col justify-between relative overflow-hidden group">
      {/* Structural Accent Top-Border Marker on Hover */}
      <div className="absolute top-0 right-0 left-0 h-[3px] bg-transparent group-hover:bg-[#0058be]/30 transition-colors duration-300" />

      <div className="flex items-start justify-between gap-4 mb-4">
        <p className="text-xs font-bold text-[#475569] tracking-wide leading-relaxed">
          {title}
        </p>

        {/* Enclosed Icon Container with clear border bounding */}
        <div
          className={`p-2.5 rounded-xl border transition-all duration-300 ${currentStyle}`}
        >
          {displayIcon}
        </div>
      </div>

      {/* Corporate Solid Typographic Layout (Eliminated Transparencies/Gradients) */}
      <div className="flex items-baseline gap-1.5 justify-start">
        <span className="text-2xl md:text-3xl font-black text-[#00236f] font-mono tracking-tight">
          {value}
        </span>
      </div>
    </div>
  );
}

export default StatsCard;
