import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/products/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/cart/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/accounts/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/payments/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/tickets/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
    },
  },
});
