import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      fastRefresh: {
        warnOnUnstableExports: false, // Tắt cảnh báo
      },
    }),
    tailwindcss(),
  ],

  server: {
    port: 5173,
    open: true,

    proxy: {
      "/api": {
        target: "https://localhost:7169",
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});
