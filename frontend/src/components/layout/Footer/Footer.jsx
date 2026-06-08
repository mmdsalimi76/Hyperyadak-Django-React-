// Footer.jsx – Gradient background matching the header
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const persianYear = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
  }).format(new Date());

  const quickLinks = [
    { name: "خانه", path: "/" },
    { name: "محصولات", path: "/all-products" },
    { name: "درباره ما", path: "/about" },
    { name: "تماس با ما", path: "/contact" },
  ];

  return (
    <footer className="bg-gradient-to-r from-sky-600 to-indigo-700 text-white/80 pt-12 pb-6 mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-4">
        {/* 4‑column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/20">
          {/* Column 1: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 text-right">
              دسترسی سریع
            </h3>
            <ul className="space-y-2 text-right">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="block hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: About Us */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 text-right">
              درباره هایپر یدک
            </h3>
            <p className="text-sm text-right leading-relaxed text-white/80">
              ما در هایپر یدک فاصله میان تولید کننده و مصرف کننده را برداشته ایم
              تا شما بدون دغدغه های مرسوم بازار به کیفیت دسترسی داشته باشید.
            </p>
            <p className="text-sm text-right leading-relaxed mt-3 text-white/80">
              راحتی شما در خرید، ماموریت اصلی ماست.
            </p>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 text-right">
              تماس با ما
            </h3>
            <ul className="space-y-2 text-sm text-right text-white/80">
              <li className="flex items-center justify-end gap-2">
                <span>تهران، خیابان اصلی، پلاک ۱۲۳</span>
                <svg
                  className="w-4 h-4 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
              </li>
              <li className="flex items-center justify-end gap-2">
                <span>۰۲۱‑۱۲۳۴۵۶۷۸</span>
                <svg
                  className="w-4 h-4 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </li>
              <li className="flex items-center justify-end gap-2">
                <span>info@sepehryadak.com</span>
                <svg
                  className="w-4 h-4 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </li>
            </ul>
            <div className="flex justify-end gap-4 mt-4">
              <a href="#" className="text-white/70 hover:text-white transition">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.6-12.2c0-.213-.005-.426-.015-.637A9.936 9.936 0 0024 4.559z" />
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.88.001 1.44 1.44 0 01-2.88-.001z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 4: Enamad dummy icon – light glass style */}
          <div>
            <div className="flex justify-end">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center w-full max-w-[150px] border border-white/20">
                <svg
                  className="w-12 h-12 mx-auto text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <p className="text-xs text-white/60 mt-2">نماد اعتماد</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright row */}
        <div className="text-center text-sm text-white/60 pt-6">
          <p>© {persianYear} هایپر یدک - تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
