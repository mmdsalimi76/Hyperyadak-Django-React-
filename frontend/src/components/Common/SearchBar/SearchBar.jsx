import React, { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

const SearchIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const SearchBar = forwardRef(
  (
    {
      placeholder = "جستجوی قطعات...",
      className = "",
      inputClassName = "",
      value,
      onChange,
      onSubmit: externalOnSubmit,
    },
    ref,
  ) => {
    const navigate = useNavigate();
    const isControlled = value !== undefined && onChange !== undefined;

    const handleSubmit = (e) => {
      e.preventDefault();
      let searchValue;
      if (isControlled) {
        searchValue = value;
      } else {
        const input = e.currentTarget.elements?.search;
        searchValue = input?.value;
      }

      if (searchValue && searchValue.trim()) {
        if (externalOnSubmit) {
          externalOnSubmit(searchValue.trim());
        } else {
          navigate(
            `/products?search=${encodeURIComponent(searchValue.trim())}`,
          );
        }
      }
    };

    return (
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center group ${className}`}
      >
        <input
          ref={ref}
          type="text"
          name="search"
          value={isControlled ? value : undefined}
          onChange={isControlled ? onChange : undefined}
          placeholder={placeholder}
          className={`w-full bg-white/40 border border-[#c5c5d3]/40 text-[#141b2b] placeholder-[#444651]/50 text-sm rounded-xl py-2.5 pr-11 pl-4 outline-none transition-all duration-300 backdrop-blur-sm focus:bg-white focus:border-[#0058be] focus:shadow-[0_0_20px_rgba(0,88,190,0.06)] ${inputClassName}`}
        />

        <div className="absolute right-4 pointer-events-none z-10 text-[#00236f]/60 group-focus-within:text-[#0058be] transition-colors duration-300 flex items-center">
          <SearchIcon className="w-4 h-4" />
        </div>
      </form>
    );
  },
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
