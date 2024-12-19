import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import { viteStaticCopy } from "vite-plugin-static-copy";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: ["vite.svg"],
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        short_name: "Paint",
        name: "Canvas Drawing Application",
        icons: [
          {
            src: "android/android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "android/android-launchericon-192-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android/android-launchericon-144-144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "android/android-launchericon-96-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "android/android-launchericon-72-72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "android/android-launchericon-48-48.png",
            sizes: "48x48",
            type: "image/png",
          },
        ],
        start_url: "/",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        scope: "/",
        orientation: "portrait",
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        // تنظیمات workbox برای cache کردن منابع
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,woff,woff2,ttf}"],
      },
    }),
    viteStaticCopy({
      targets: [
        { src: "public/manifest.json", dest: "" },
        { src: "public/service-worker.js", dest: "" },
      ],
    }),
  ],
  server: {
    host: "0.0.0.0", // برای دسترسی به سایت از هر دستگاه در شبکه محلی
    port: 4173, // پورت مورد نظر شما
    open: true, // این گزینه به طور خودکار مرورگر را باز می‌کند
  },
  // base: "/Canvas-Drawing-App/", // اضافه کردن این برای GitHub Pages
  base: "./", 
  resolve: {
    alias: {
      "@hook": path.resolve(__dirname, "src/hook"),
    },
  },
});
