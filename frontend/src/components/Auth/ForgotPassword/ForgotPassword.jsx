import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const requestOtp = async () => {
    if (!phone) {
      setError("شماره موبایل الزامی است");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/accounts/api/v1/send-otp/", {
        phone_number: phone,
      });
      setInfo("کد OTP برای شماره شما ارسال شد");
      setStep(2);
    } catch (e) {
      setError(e.response?.data?.detail || "خطا در ارسال OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPwd = async () => {
    if (!otp || !newPass || !confirmPass) {
      setError("لطفاً تمام فیلدها را پر کنید");
      return;
    }
    if (newPass !== confirmPass) {
      setError("رمزهای عبور مطابقت ندارند");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8000/accounts/api/v1/reset-password/",
        {
          phone_number: phone,
          otp,
          new_password: newPass,
          confirm_password: confirmPass,
        },
      );
      setInfo("رمز عبور با موفقیت بازنشانی شد");
      navigate("/login");
    } catch (e) {
      setError(e.response?.data?.detail || "خطا در بازنشانی رمز عبور");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setError("");
    setInfo("");
    try {
      await axios.post("http://localhost:8000/accounts/api/v1/send-otp/", {
        phone_number: phone,
      });
      setInfo("کد جدید ارسال شد");
      setResendCooldown(30);
    } catch (e) {
      setError(e.response?.data?.detail || "خطا در ارسال OTP");
    }
  };

  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(
      () => setResendCooldown((c) => Math.max(c - 1, 0)),
      1000,
    );
    return () => clearInterval(timer);
  }, [resendCooldown]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-start mb-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-sky-600 flex items-center gap-1 text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            بازگشت به خانه
          </button>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">
          بازیابی رمز عبور
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}
        {info && (
          <div className="bg-green-100 border border-green-400 text-green-700 p-2 rounded mb-4">
            {info}
          </div>
        )}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              requestOtp();
            }}
            className="space-y-4"
          >
            <label className="block text-sm font-medium mb-1">
              شماره موبایل
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-gray-100 rounded-xl py-3 px-4"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 disabled:opacity-50"
            >
              {loading ? "در حال ارسال..." : "ارسال رمز یک بار مصرف"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              resetPwd();
            }}
            className="space-y-4"
          >
            <label className="block text-sm font-medium mb-1">کد OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full bg-gray-100 rounded-xl py-3 px-4"
            />
            <label className="block text-sm font-medium mb-1">
              رمز عبور جدید
            </label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
              className="w-full bg-gray-100 rounded-xl py-3 px-4"
            />
            <label className="block text-sm font-medium mb-1">
              تکرار رمز عبور
            </label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
              className="w-full bg-gray-100 rounded-xl py-3 px-4"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 disabled:opacity-50"
            >
              {loading ? "در حال بازنشانی..." : "بازنشانی رمز عبور"}
            </button>
            <button
              type="button"
              onClick={resendOtp}
              disabled={resendCooldown > 0}
              className="text-sky-600 hover:underline disabled:text-gray-400 mt-2"
            >
              {resendCooldown > 0
                ? `ارسال مجدد در ${resendCooldown}s`
                : "ارسال مجدد OTP"}
            </button>
          </form>
        )}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            حساب کاربری دارید?{" "}
            <Link
              to="/login"
              className="text-sky-600 font-bold hover:underline"
            >
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
