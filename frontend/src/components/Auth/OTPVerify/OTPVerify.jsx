import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

function OTPVerify() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext

  const stateData = location.state || {};
  const phone_number =
    stateData.phone_number || sessionStorage.getItem("otp_phone");
  const password = stateData.password || "";
  const password1 = stateData.password1 || "";

  const redirectTo = stateData.redirectTo || null;

  if (phone_number) sessionStorage.setItem("otp_phone", phone_number);
  if (redirectTo) sessionStorage.setItem("otp_redirect", redirectTo);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (!phone_number) {
        setError("شماره موبایل موجود نیست؛ لطفاً دوباره ثبت نام کنید");
        return;
      }

      // Verify OTP
      await axios.post("http://localhost:8000/accounts/api/v1/verify-otp/", {
        phone_number,
        otp,
      });

      // Register user
      await axios.post("http://localhost:8000/accounts/api/v1/registration/", {
        phone_number,
        password,
        password1,
      });

      // Auto-login after successful registration
      const loginSuccess = await login(phone_number, password);
      if (!loginSuccess) {
        throw new Error("خودکار ورود انجام نشد. لطفاً وارد شوید.");
      }

      // Determine final destination
      const finalDestination =
        redirectTo || sessionStorage.getItem("otp_redirect") || "/dashboard";

      // Clear OTP session cache
      sessionStorage.removeItem("otp_phone");
      sessionStorage.removeItem("otp_redirect");

      navigate(finalDestination);
    } catch (err) {
      console.error("OTP verification or auto-login error:", err);
      setError(err.response?.data?.detail || err.message || "خطا در تأیید OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setInfo("");
    setError("");
    try {
      await axios.post("http://localhost:8000/accounts/api/v1/send-otp/", {
        phone_number,
      });
      setInfo("کد جدید ارسال شد");
      setResendCooldown(30);
    } catch (err) {
      setError(err.response?.data?.detail || "خطا در ارسال OTP");
    }
  };

  // Countdown timer for resend cooldown
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((c) => Math.max(c - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#e0f2fe] via-[#f4f9ff] to-[#ffffff] text-[#1e293b] antialiased flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Brand Ambient Light Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#0058be]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#0058be]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 md:p-10 bg-white rounded-2xl shadow-[0_12px_40px_-15px_rgba(0,88,190,0.12)] border border-[#0058be]/10 relative z-10">
        {/* Back to Home Action Row */}
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

        {/* Brand Header Node */}
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-[#00236f] tracking-tight">
            هایپر یدک
          </h1>
          <p className="text-[#475569] text-sm font-medium">
            تأیید کد ورود دو مرحله‌ای
          </p>
          {phone_number && (
            <p
              className="text-xs font-semibold text-[#0058be] tracking-wider mt-1 bg-[#f0f7ff] inline-block px-3 py-1 rounded-full"
              dir="ltr"
            >
              {phone_number}
            </p>
          )}
        </div>

        {/* Alert Notifications Zone */}
        {error && (
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
            <span>{error}</span>
          </div>
        )}
        {info && (
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
            <span>{info}</span>
          </div>
        )}

        {/* Verification Form Block */}
        <form onSubmit={handleVerify} className="space-y-5 text-right">
          <div>
            <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1">
              کد تأیید پیامک شده
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              required
              dir="ltr"
              className="w-full bg-white border border-[#0058be]/15 focus:border-[#0058be] rounded-xl py-3.5 px-4 text-center text-lg tracking-[0.5em] font-extrabold text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[#0058be]/5 shadow-sm placeholder-gray-300 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0058be] text-white py-4 rounded-xl font-bold text-sm shadow-md hover:bg-[#0058be]/90 hover:shadow-[0_8px_25px_rgba(0,88,190,0.2)] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? "در حال تایید..." : "تأیید و ساخت حساب کاربری"}
          </button>
        </form>

        {/* Dynamic Resend Action Area */}
        <div className="mt-5 text-center">
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-xs font-bold text-[#0058be] hover:underline disabled:text-gray-400 disabled:no-underline transition-colors bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 inline-flex items-center gap-1.5"
          >
            {resendCooldown > 0 ? (
              <>
                <svg
                  className="w-3.5 h-3.5 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>ارسال مجدد کد در {resendCooldown} ثانیه</span>
              </>
            ) : (
              <span>درخواست مجدد کد تأیید</span>
            )}
          </button>
        </div>

        {/* Existing Account Link Node */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-[#475569] font-medium">
          <p>
            حساب کاربری دارید؟{" "}
            <Link
              to="/login"
              className="text-[#0058be] font-extrabold hover:underline decoration-1 underline-offset-4"
            >
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OTPVerify;
