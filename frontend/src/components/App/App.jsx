// App.jsx – Clean and maintainable routing with CartProvider and Cart page
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "../../context/AuthContext";
import { CartProvider } from "../../context/CartContext";
import PaymentsRoutes from "../Payments/PaymentsRoutes";
import Checkout from "../Payments/Checkout";
import PaymentCallback from "../Payments/PaymentCallback";

// Layout components
import Layout from "../layout/Layout/Layout";
import ProtectedRoute from "../Auth/ProtectedRoute/ProtectedRoute";

// Error handling
import { ErrorBoundary, NotFound } from "../Common/errors";

// Pages
import HomePage from "../Home/Home";
import AboutPage from "../About/About";
import ContactPage from "../Contact/Contact";
import Login from "../Auth/Login/Login";
import Signup from "../Auth/Signup/Signup";
import OTPVerify from "../Auth/OTPVerify/OTPVerify";
import ForgotPassword from "../Auth/ForgotPassword/ForgotPassword";
import Dashboard from "../Dashboard/Dashboard/Dashboard";
import ProductDetail from "../Products/ProductDetail";
import SearchResults from "../Products/SearchResults";
import AllProducts from "../Products/AllProducts";
import CategoryPage from "../Pages/CategoryPage";
import CarBrandPage from "../Pages/CarBrandPage";
import ProductBrandPage from "../Pages/ProductBrandPage";
import CarModelPage from "../Pages/CarModelPage";
import Cart from "../Cart/Cart";

// Create a QueryClient instance (shared across the app)
const queryClient = new QueryClient();

// HOC for applying layout cleanly
const withLayout = (Component) => (
  <Layout>
    <Component />
  </Layout>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <Routes>
                {/* Public routes with main layout */}
                <Route path="/" element={withLayout(HomePage)} />
                <Route path="/about" element={withLayout(AboutPage)} />
                <Route path="/contact" element={withLayout(ContactPage)} />
                <Route
                  path="/product/:slug"
                  element={withLayout(ProductDetail)}
                />
                <Route path="/products" element={withLayout(SearchResults)} />
                <Route path="/all-products" element={withLayout(AllProducts)} />
                <Route
                  path="/categories/:slug"
                  element={withLayout(CategoryPage)}
                />
                <Route
                  path="/car-brands/:slug"
                  element={withLayout(CarBrandPage)}
                />
                <Route
                  path="/product-brands/:slug"
                  element={withLayout(ProductBrandPage)}
                />
                <Route
                  path="/car-models/:slug"
                  element={withLayout(CarModelPage)}
                />

                {/* Cart page */}
                <Route path="/cart" element={withLayout(Cart)} />

                {/* Auth helper pages */}
                <Route path="/otp-verify" element={<OTPVerify />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Payment flows */}
                <Route path="/checkout" element={withLayout(Checkout)} />
                <Route
                  path="/payment-callback"
                  element={withLayout(PaymentCallback)}
                />
                <Route path="/payments/*" element={<PaymentsRoutes />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Dashboard – FIXED layout wrapper instantiation */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Fallback 404 handler */}
                <Route path="*" element={withLayout(NotFound)} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
