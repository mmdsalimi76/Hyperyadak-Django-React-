import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Reusable SVG Eye Icons
const EyeIcon = ({ visible }) => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    {visible ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    ) : (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </>
    )}
  </svg>
);

// Reusable Password Input Sub-Component
const PasswordField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  show,
  onToggle,
}) => (
  <div>
    <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1">
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        dir="ltr"
        className="w-full bg-white border border-[#0058be]/15 focus:border-[#0058be] rounded-xl py-3.5 px-12 text-sm tracking-wider font-semibold text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[#0058be]/5 shadow-sm placeholder-gray-400/80 transition-all duration-200"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0058be] transition-colors duration-200"
      >
        <EyeIcon visible={show} />
      </button>
    </div>
  </div>
);

function Signup() {
  const [formData, setFormData] = useState({
    phone_number: "",
    password: "",
    password1: "",
  });

  const [visibility, setVisibility] = useState({
    password: false,
    password1: false,
  });
  const [status, setStatus] = useState({ error: "", info: "", loading: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone_number) {
      setStatus({ error: "شماره موبایل الزامی است", info: "", loading: false });
      return;
    }
    if (formData.password !== formData.password1) {
      setStatus({
        error: "رمزهای عبور مطابقت ندارند",
        info: "",
        loading: false,
      });
      return;
    }

    setStatus({ error: "", info: "", loading: true });

    try {
      const apiBase = import.meta.env?.VITE_API_URL || "http://localhost:8000";

      await axios.post(`${apiBase}/accounts/api/v1/send-otp/`, {
        phone_number: formData.phone_number,
      });

      setStatus({
        error: "",
        info: "کد OTP برای شماره شما ارسال شد",
        loading: false,
      });
      navigate("/otp-verify", { state: { ...formData } });
    } catch (err) {
      setStatus({
        error: err.response?.data?.detail || err.message || "خطا در ارسال OTP",
        info: "",
        loading: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#e0f2fe] via-[#f4f9ff] to-[#ffffff] text-[#1e293b] antialiased flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#0058be]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#0058be]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 md:p-10 bg-white rounded-2xl shadow-[0_12px_40px_-15px_rgba(0,88,190,0.12)] border border-[#0058be]/10 relative z-10">
        {/* Back to Home Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-[#475569] hover:text-[#0058be] transition-colors duration-200 flex items-center gap-1.5 text-xs font-bold bg-[#f0f7ff] hover:bg-[#e0f2fe] px-3 py-1.5 rounded-lg"
          >
            <span>بازگشت به صفحه اصلی</span>
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Identity Branding Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0058be]/10 text-[#0058be] mb-2 shadow-inner">
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
                strokeWidth="1.75"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-[#00236f] tracking-tight">
            هایپر یدک
          </h1>
          <p className="text-[#475569] text-sm font-medium">
            ایجاد حساب کاربری جدید در سامانه
          </p>
        </div>

        {/* Alert Zone notifications */}
        {status.error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 text-right justify-start"
            dir="rtl"
          >
            <svg
              className="w-4 h-4 shrink-0"
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
            <span>{status.error}</span>
          </div>
        )}

        {status.info && (
          <div
            className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 text-right justify-start"
            dir="rtl"
          >
            <svg
              className="w-4 h-4 shrink-0"
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
            <span>{status.info}</span>
          </div>
        )}

        {/* Submission Form Context */}
        <form onSubmit={handleSubmit} className="space-y-5 text-right">
          <div>
            <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1">
              شماره موبایل
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="09123456789"
              required
              dir="ltr"
              className="w-full bg-white border border-[#0058be]/15 focus:border-[#0058be] rounded-xl py-3.5 px-4 text-sm tracking-wider font-semibold text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[#0058be]/5 shadow-sm placeholder-gray-400/80 transition-all duration-200"
            />
          </div>

          <PasswordField
            label="رمز عبور"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            show={visibility.password}
            onToggle={() => toggleVisibility("password")}
          />

          <PasswordField
            label="تکرار رمز عبور"
            name="password1"
            value={formData.password1}
            onChange={handleChange}
            placeholder="••••••••"
            show={visibility.password1}
            onToggle={() => toggleVisibility("password1")}
          />

          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-[#0058be] text-white py-4 rounded-xl font-bold text-sm shadow-md hover:bg-[#0058be]/90 hover:shadow-[0_8px_25px_rgba(0,88,190,0.2)] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {status.loading ? "در حال درخواست کد تایید..." : "ارسال کد تایید"}
          </button>
        </form>

        {/* Login Redirect */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-[#475569] font-medium">
          <p>
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link
              to="/login"
              className="text-[#0058be] font-extrabold hover:underline decoration-1 underline-offset-4"
            >
              وارد حساب کاربری خود شوید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
