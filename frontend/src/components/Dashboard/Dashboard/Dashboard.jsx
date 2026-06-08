// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useDashboardData } from "../../../hooks/useDashboardData.js";
import { useProfileUpdate } from "../../../hooks/useProfileUpdate.js";
import { usePasswordChange } from "../../../hooks/usePasswordChange.js";
import { useSaveAddress, useDeleteAddress } from "../../../hooks/useAddress.js";
import { usePayOrder, useCancelOrder } from "../../../hooks/useOrderActions.js";
import Sidebar from "../Sidebar/Sidebar";
import StatsCard from "../StatsCard/StatsCard";
import OrdersTab from "../OrdersTab/OrdersTab";
import AddressesTab from "../AddressesTab/AddressesTab";
import PasswordTab from "../PasswordTab/PasswordTab";
import AccountTab from "../AccountTab/AccountTab";
import TicketsTab from "../TicketsTab/TicketsTab";
import Loader from "../../Common/Loader/Loader";

function Dashboard() {
  const { isAuthenticated, logout, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState("orders");

  // React Query hooks
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch: refetchDashboard,
  } = useDashboardData();
  const profileUpdate = useProfileUpdate();
  const passwordChange = usePasswordChange();
  const saveAddress = useSaveAddress();
  const deleteAddress = useDeleteAddress();
  const payOrder = usePayOrder();
  const cancelOrder = useCancelOrder();

  // Local UI state for forms
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
  });

  const [formMessage, setFormMessage] = useState({ type: "", text: "" });

  // Update local form when dashboard data loads
  useEffect(() => {
    if (dashboardData) {
      setProfileForm({
        first_name: dashboardData.first_name || "",
        last_name: dashboardData.last_name || "",
      });
    }
  }, [dashboardData]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Handle tab from location state
  useEffect(() => {
    if (location.state?.activeTab) {
      setCurrentTab(location.state.activeTab);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#e0f2fe] via-[#f4f9ff] to-[#ffffff] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-[0_12px_40px_-15px_rgba(0,88,190,0.12)] border border-red-100 p-8 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#1e293b] mb-6">
            {error.message || "خطا در بارگذاری اطلاعات"}
          </p>
          <button
            onClick={() => refetchDashboard()}
            className="px-6 py-2.5 bg-[#0058be] text-white text-xs font-bold rounded-xl"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  const activeOrders =
    dashboardData.orders?.filter(
      (order) => order.status !== "delivered" && order.status !== "cancelled",
    ).length || 0;

  const completedOrders =
    dashboardData.orders?.filter((order) => order.status === "delivered")
      .length || 0;

  const displayName =
    dashboardData.first_name || dashboardData.last_name
      ? `${dashboardData.first_name} ${dashboardData.last_name}`.trim()
      : "کاربر گرامی";

  // Form handlers
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setFormMessage({ type: "", text: "" });
    try {
      await profileUpdate.mutateAsync(profileForm);
      setFormMessage({
        type: "success",
        text: "پروفایل با موفقیت به‌روزرسانی شد",
      });
    } catch (err) {
      setFormMessage({ type: "error", text: "خطا در ثبت تغییرات" });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setFormMessage({ type: "error", text: "رمزهای عبور جدید مطابقت ندارند" });
      return;
    }
    setFormMessage({ type: "", text: "" });
    try {
      await passwordChange.mutateAsync({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password,
      });
      setFormMessage({
        type: "success",
        text: "رمز عبور با موفقیت تغییر یافت",
      });
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setFormMessage({ type: "error", text: "خطا در تغییر رمز عبور" });
    }
  };

  const handleSaveAddress = async (addressData) => {
    try {
      await saveAddress.mutateAsync(addressData);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteAddress = async () => {
    try {
      await deleteAddress.mutateAsync();
    } catch (err) {
      throw err;
    }
  };

  const handlePayOrder = async (orderId) => {
    try {
      await payOrder.mutateAsync(orderId);
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder.mutateAsync(orderId);
    } catch (error) {
      console.error("Cancel error:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-tr from-[#e0f2fe]/40 via-[#f4f9ff] to-[#ffffff] text-[#1e293b] antialiased relative overflow-hidden pb-12"
      dir="rtl"
    >
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#0058be]/3 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-10 relative z-10">
        <div className="mb-8 animate-fadeIn flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#0058be]/5 pb-5">
          <div>
            <h1 className="text-2xl font-black text-[#00236f] tracking-tight">
              خوش آمدید، {displayName}
            </h1>
            <p className="text-xs text-[#475569] font-medium mt-1">
              مدیریت سفارش‌ها، فاکتورها و مشخصات حساب
            </p>
          </div>
          <div className="text-left font-semibold text-xs text-[#0058be] bg-[#f0f7ff] px-4 py-2 rounded-xl border border-[#0058be]/10">
            داشبورد
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-6">
            <Sidebar
              displayName={displayName}
              phoneNumber={dashboardData.phone_number}
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              onLogout={logout}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
              <StatsCard
                title="سفارش‌های فعال"
                value={activeOrders}
                color="sky"
              />
              <StatsCard
                title="سفارش‌های تکمیل شده"
                value={completedOrders}
                color="emerald"
              />
              <StatsCard
                title="تیکت‌های پشتیبانی فعال"
                value={dashboardData.active_tickets_count || 0}
                color="indigo"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,88,190,0.04)] border border-[#0058be]/10 overflow-hidden">
              <div className="p-6 md:p-8">
                {currentTab === "orders" && (
                  <OrdersTab
                    orders={dashboardData.orders || []}
                    onPayOrder={handlePayOrder}
                    onCancelOrder={handleCancelOrder}
                  />
                )}
                {currentTab === "addresses" && (
                  <AddressesTab
                    address={dashboardData.address}
                    onSave={handleSaveAddress}
                    onDelete={handleDeleteAddress}
                  />
                )}
                {currentTab === "password" && (
                  <PasswordTab
                    passwordData={passwordData}
                    setPasswordData={setPasswordData}
                    formLoading={passwordChange.isPending}
                    formMessage={formMessage}
                    onSubmit={handlePasswordChange}
                  />
                )}
                {currentTab === "account" && (
                  <AccountTab
                    profileForm={profileForm}
                    setProfileForm={setProfileForm}
                    phoneNumber={dashboardData.phone_number}
                    formLoading={profileUpdate.isPending}
                    formMessage={formMessage}
                    onSubmit={handleProfileUpdate}
                  />
                )}
                {currentTab === "tickets" && <TicketsTab />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}

export default Dashboard;
