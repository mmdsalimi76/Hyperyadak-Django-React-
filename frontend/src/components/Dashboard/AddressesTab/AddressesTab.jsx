// src/components/Dashboard/AddressesTab/AddressesTab.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";

function AddressesTab({ address, onSave, onDelete }) {
  const navigate = useNavigate();
  const { cart } = useCart(); // <-- get cart state
  const [isEditing, setIsEditing] = useState(!address);
  const [formData, setFormData] = useState(
    address || {
      full_address: "",
      city: "",
      state: "",
      postal_code: "",
    },
  );
  const [submitting, setSubmitting] = useState(false);

  const isPostalCodeValid = /^\d{10}$/.test(formData.postal_code);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPostalCodeValid) return;

    setSubmitting(true);
    try {
      await onSave(formData);
      setIsEditing(false);

      // Redirect to cart if there are items in the cart
      if (cart && cart.items && cart.items.length > 0) {
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("آیا از حذف این آدرس اطمینان دارید؟")) {
      try {
        await onDelete();
        setFormData({
          full_address: "",
          city: "",
          state: "",
          postal_code: "",
        });
        setIsEditing(true);
      } catch (error) {
        console.error("Error deleting address:", error);
      }
    }
  };

  // 1. View Mode
  if (!isEditing && address) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md hover:border-[#0058be]/10 transition-all duration-300 text-right animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5">
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-[#0058be]/5 p-2 rounded-xl text-[#0058be] shrink-0">
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
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-sm text-[#1e293b] leading-relaxed">
                  {address.full_address}
                </h4>
                <div className="flex flex-wrap items-center gap-x-2 text-xs font-semibold text-[#475569]">
                  <span>{address.state}</span>
                  <span className="text-gray-300">•</span>
                  <span>{address.city}</span>
                  <span className="text-gray-300">|</span>
                  <span className="font-mono tracking-wider" dir="ltr">
                    کد پستی: {address.postal_code}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 self-end sm:self-start shrink-0 border-t sm:border-0 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-xs font-bold text-[#0058be] bg-[#0058be]/5 hover:bg-[#0058be]/10 rounded-xl transition-all duration-200 flex items-center gap-1.5"
            >
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>ویرایش</span>
            </button>

            {onDelete && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100/70 rounded-xl transition-all duration-200 flex items-center gap-1.5"
              >
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>حذف آدرس</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Edit / Create Mode
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm text-right animate-fadeIn">
      <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-[#0058be]/5">
        <div className="w-1 h-5 bg-[#0058be] rounded-full" />
        <h3 className="text-base font-black text-[#00236f]">
          {address ? "ویرایش نشانی ارسال" : "افزودن نشانی ارسال جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1">
            آدرس کامل پستی
          </label>
          <textarea
            value={formData.full_address}
            onChange={(e) =>
              setFormData({ ...formData, full_address: e.target.value })
            }
            rows="3"
            placeholder="نام خیابان، کوچه، پلاک، شماره واحد و..."
            className="w-full px-4 py-3 bg-white border border-[#0058be]/15 focus:border-[#0058be] rounded-xl text-sm font-semibold text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[#0058be]/5 transition-all duration-200 placeholder-gray-300 shadow-sm resize-none leading-relaxed"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1">
              استان
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              placeholder="مثال: تهران"
              className="w-full px-4 py-3 bg-white border border-[#0058be]/15 focus:border-[#0058be] rounded-xl text-sm font-semibold text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[#0058be]/5 transition-all duration-200 placeholder-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1">
              شهر
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder="مثال: تهران"
              className="w-full px-4 py-3 bg-white border border-[#0058be]/15 focus:border-[#0058be] rounded-xl text-sm font-semibold text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[#0058be]/5 transition-all duration-200 placeholder-gray-300 shadow-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#00236f] mb-2 mr-1 flex items-center justify-between">
            <span>کد پستی (۱۰ رقمی)</span>
            {isPostalCodeValid && (
              <span className="text-emerald-600 text-[10px] font-black bg-emerald-50 px-2 py-0.5 rounded-md animate-scaleUp">
                ✓ کد پستی معتبر است
              </span>
            )}
          </label>
          <input
            type="text"
            maxLength={10}
            value={formData.postal_code}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              setFormData({ ...formData, postal_code: numericValue });
            }}
            placeholder="__________"
            dir="ltr"
            className={`w-full px-4 py-3 bg-white rounded-xl text-sm font-bold text-[#1e293b] focus:outline-none transition-all duration-200 text-left tracking-widest shadow-sm ${
              isPostalCodeValid
                ? "border-2 border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                : "border border-[#0058be]/15 focus:border-[#0058be] focus:ring-4 focus:ring-[#0058be]/5"
            }`}
            required
          />
        </div>

        {/* Form Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-3">
          <button
            type="submit"
            disabled={submitting || !isPostalCodeValid}
            className="px-6 py-3 bg-[#0058be] text-white font-bold rounded-xl text-xs shadow-md hover:bg-[#0058be]/90 hover:shadow-[0_4px_12px_rgba(0,88,190,0.15)] active:scale-[0.99] transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2"
          >
            {submitting ? (
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
                <span>در حال ذخیره آدرس...</span>
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
                <span>ذخیره ثبت نشانی</span>
              </>
            )}
          </button>

          {address && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200/80 text-[#475569] font-bold rounded-xl text-xs transition-all duration-200"
            >
              انصراف
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddressesTab;
