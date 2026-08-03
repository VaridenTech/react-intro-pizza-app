import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/public": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-react-compiler",
            {
              target: "19",
            },
          ],
        ],
      },
    }),
  ],
  test: {
    // coverage อยู่ระดับนอก จะได้รวมผลของทั้งสอง project เข้าด้วยกัน
    coverage: {
      reporter: ["text", "json", "html"],
    },
    projects: [
      {
        // extends: true ทำให้ project นี้ได้ plugins/server จาก config ตัวนอก
        extends: true,
        test: {
          name: "happy-dom",
          include: ["**/*.node.test.{ts,tsx}"],
          environment: "happy-dom",
        },
      },
      {
        extends: true,
        // ต้อง pre-bundle เอง ไม่งั้น react-dom/client ถูกเสิร์ฟดิบ ๆ
        // แล้ว vitest-browser-react จะ import default export ไม่เจอ
        optimizeDeps: {
          include: ["react", "react-dom", "react-dom/client"],
        },
        test: {
          name: "browser",
          include: ["**/*.browser.test.{ts,tsx}"],
          setupFiles: ["vitest-browser-react"],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [
              // ใช้ chromium เพราะ coverage v8 จากบทที่ 28 รองรับเฉพาะ chromium
              // ถ้าอยากใช้ firefox/webkit ต้องเปลี่ยนไปใช้ provider istanbul แทน
              { browser: "chromium" },
            ],
          },
        },
      },
    ],
  },
});
