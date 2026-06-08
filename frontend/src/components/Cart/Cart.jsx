import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api, { cartAPI } from "../../services/api";

function Cart() {
  const { cart, fetchCart, setCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  // Helper: convert relative image path to absolute URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = import.meta.env?.VITE_API_URL || "http://localhost:8000";
    return `${baseUrl}${imagePath}`;
  };

  // Helper to recalculate total local state prices after changing quantities or deleting
  const updateLocalCartStorageAndState = (updatedItems) => {
    const total_price = updatedItems.reduce((sum, item) => {
      const price = item.product_price || item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
    const updatedCart = { items: updatedItems, total_price };
    localStorage.setItem("local_cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingItemId(itemId);
    try {
      if (!isAuthenticated) {
        // Guest Local State Update Track
        const updatedItems = cart.items.map((item) => {
          const stableId = item.id || item.product_id || item.product?.id;
          return stableId === itemId
            ? { ...item, quantity: newQuantity }
            : item;
        });
        updateLocalCartStorageAndState(updatedItems);
      } else {
        // Authenticated Database Track
        await cartAPI.updateCartItem(itemId, newQuantity);
        await fetchCart();
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Intercepting Auth states before sending checkout payload

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert(
        "لطفاً برای تکمیل فرآیند خرید، ابتدا ثبت‌نام کنید یا وارد حساب کاربری خود شوید.",
      );
      navigate("/signup", { state: { redirectTo: "/cart" } });
      return;
    }

    setCheckingOut(true);

    try {
      // 1. Fetch the user's address (or check if exists)
      let addressId = null;
      try {
        const addressRes = await api.get("/accounts/api/v1/address/");
        addressId = addressRes.data.id;
      } catch (err) {
        // No address found – redirect to address creation page
        alert("لطفاً ابتدا آدرس تحویل خود را ثبت کنید.");
        navigate("/dashboard", { state: { activeTab: "addresses" } }); // adjust to your address edit route
        setCheckingOut(false);
        return;
      }

      // 2. Build order items from current cart
      const itemsForOrder = cart.items.map((item) => ({
        product_id: item.product_id || item.product,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.product_price || item.price,
      }));

      // 3. Call order creation endpoint
      const response = await cartAPI.checkout(addressId, itemsForOrder);

      // 4. Redirect to checkout page with the new order ID
      navigate(`/checkout?order_id=${response.order_id}`);
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.");
    } finally {
      setCheckingOut(false);
    }
  };

  const removeItem = async (itemId, productName) => {
    if (
      window.confirm(
        `آیا از حذف قطعه "${productName}" از سبد خرید خود اطمینان دارید؟`,
      )
    ) {
      setUpdatingItemId(itemId);
      try {
        if (!isAuthenticated) {
          // Guest Local State Delete Track
          const updatedItems = cart.items.filter((item) => {
            const stableId = item.id || item.product_id || item.product?.id;
            return stableId !== itemId;
          });
          updateLocalCartStorageAndState(updatedItems);
        } else {
          // Authenticated Database Track
          await cartAPI.removeCartItem(itemId);
          await fetchCart();
        }
      } catch (error) {
        console.error("Remove error:", error);
      } finally {
        setUpdatingItemId(null);
      }
    }
  };

  // Empty State Fallback Rendering Control
  if (!cart || !cart.items?.length) {
    return (
      <div className="w-full text-right" dir="rtl">
        <div className="w-full bg-[#00236f] py-10 md:py-12 mb-10 text-center relative overflow-hidden shadow-xs">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(30deg,#0058be_12%,transparent_12.1%),linear-gradient(150deg,#0058be_12%,transparent_12.1%)] bg-[size:32px_32px]"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              سبد خرید پردازش کالا
            </h1>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 mb-24 text-center">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xs flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-sm font-black text-[#1e293b] mb-1">
              سبد خرید شما در حال حاضر خالی است
            </h2>
            <p className="text-[11px] font-bold text-gray-400 mb-6">
              هیچ قطعه یا ملزوماتی به لیست خریدهای خود اضافه نکرده‌اید.
            </p>
            <Link
              to="/all-products"
              className="w-full bg-[#0058be] hover:bg-[#00236f] text-white text-xs font-bold py-3 px-6 rounded-xl shadow-2xs transition-colors duration-150 text-center"
            >
              بازگشت و مشاهده کاتالوگ قطعات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = cart.total_price || 0;
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full text-right" dir="rtl">
      <div className="w-full bg-[#00236f] py-10 md:py-12 mb-10 text-center relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(30deg,#0058be_12%,transparent_12.1%),linear-gradient(150deg,#0058be_12%,transparent_12.1%)] bg-[size:32px_32px]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#0058be] rounded-full hidden md:block" />
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              سبد خرید
            </h1>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full border border-white/10">
            <span className="text-xs font-mono font-black text-white">
              {itemCount}
            </span>
            <span className="text-[10px] font-bold text-blue-200">
              قلم کالا منتخب
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => {
              console.log("CRITICAL GUEST ITEM INSPECTION:", item);
              // Normalized IDs handles both guest dictionary structures and Django nested serializers keys
              const stableId =
                item.id ||
                item.product_id ||
                item.product?.id ||
                `local-item-${index}`;
              const isItemUpdating = updatingItemId === stableId;

              // Key resolution fallbacks
              const itemName =
                item.product_name || item.product?.name || "قطعه سفارشی";
              const itemPrice = item.product_price || item.product?.price || 0;
              const itemImage =
                item.product_image || item.product?.image || null;

              return (
                <div
                  key={stableId}
                  className={`bg-white rounded-2xl border transition-all duration-200 p-4 md:p-5 relative overflow-hidden ${
                    isItemUpdating
                      ? "border-[#0058be]/30 opacity-70"
                      : "border-gray-100 shadow-2xs hover:shadow-xs"
                  }`}
                >
                  <div className="flex gap-4 items-start md:items-center">
                    <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0 p-1.5 overflow-hidden">
                      {itemImage ? (
                        <img
                          src={getImageUrl(itemImage)}
                          alt={itemName}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <svg
                          className="w-7 h-7 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-6 min-w-0">
                        <h3 className="font-black text-xs text-[#1e293b] line-clamp-2 tracking-tight mb-1 leading-relaxed">
                          {itemName}
                        </h3>
                        <p className="text-[10px] font-mono font-black text-gray-400">
                          قیمت واحد: {Number(itemPrice).toLocaleString("en-US")}{" "}
                          <span className="text-[9px] font-sans font-bold text-gray-400">
                            تومان
                          </span>
                        </p>
                      </div>

                      <div className="md:col-span-3 flex items-center justify-start md:justify-center">
                        <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-xl p-1">
                          <button
                            onClick={() =>
                              updateQuantity(stableId, item.quantity + 1)
                            }
                            disabled={updatingItemId !== null}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-xs font-black text-gray-600 hover:bg-[#0058be] hover:text-white disabled:opacity-40 transition-colors"
                          >
                            +
                          </button>
                          <span className="w-8 text-center font-mono text-xs font-black text-[#1e293b]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(stableId, item.quantity - 1)
                            }
                            disabled={
                              updatingItemId !== null || item.quantity <= 1
                            }
                            className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-xs font-black text-gray-600 hover:bg-[#0058be] hover:text-white disabled:opacity-40 transition-colors"
                          >
                            -
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-3 text-left flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-gray-50 pt-2 md:pt-0">
                        <span className="text-[10px] font-bold text-gray-400 md:hidden">
                          قیمت کل:
                        </span>
                        <p className="font-mono font-black text-xs text-[#0058be]">
                          {(itemPrice * item.quantity).toLocaleString("en-US")}{" "}
                          <span className="text-[10px] font-bold text-gray-400 font-sans mr-0.5">
                            تومان
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-3 left-3">
                    <button
                      onClick={() => removeItem(stableId, itemName)}
                      disabled={updatingItemId !== null}
                      className="w-7 h-7 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors disabled:opacity-30"
                      title="حذف از سبد"
                    >
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
                          strokeWidth="1.8"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-xs p-5 sticky top-24">
              <h2 className="text-xs font-black text-[#00236f] border-b border-gray-100 pb-3.5 mb-4">
                خلاصه وضعیت فاکتور خرید
              </h2>

              <div className="space-y-3.5 pb-4 border-b border-gray-50">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#475569]">
                    تعداد کل قطعات:
                  </span>
                  <span className="font-mono font-black text-[#1e293b] bg-gray-50 px-2.5 py-0.5 rounded-md border border-gray-100/50">
                    {itemCount} عدد
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#475569]">
                    هزینه پرداختنی قطعات:
                  </span>
                  <span className="font-mono font-black text-sm text-[#10b981]">
                    {totalPrice.toLocaleString("en-US")}{" "}
                    <span className="text-[10px] font-bold text-gray-400 font-sans mr-0.5">
                      تومان
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 mb-5">
                <span className="text-xs font-black text-[#1e293b]">
                  مبلغ نهایی قابل پرداخت:
                </span>
                <div className="text-left">
                  <span className="font-mono font-black text-lg text-[#00236f] tracking-tight">
                    {totalPrice.toLocaleString("en-US")}
                  </span>
                  <span className="text-[10px] font-black text-[#1e293b] mr-1">
                    تومان
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut || updatingItemId !== null}
                  className="w-full bg-[#0058be] hover:bg-[#00236f] text-white py-3 rounded-xl font-bold text-xs shadow-2xs hover:shadow-xs transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {checkingOut && (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  <span>تایید و انتخاب آدرس ارسال</span>
                </button>

                <Link
                  to="/all-products"
                  className="block text-center text-[11px] font-bold text-gray-400 hover:text-[#0058be] transition-colors pt-1"
                >
                  افزودن قطعات دیگر به سبد خرید
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
