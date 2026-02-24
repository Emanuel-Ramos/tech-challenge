import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "apps/**/*.test.{ts,tsx}",
      "packages/**/*.test.{ts,tsx}",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        ".next/",
        "coverage/",
        "**/*.config.*",
        "**/types/**",
      ],
    },
    server: {
      deps: {
        inline: ["@shipay/design-system", "@shipay/types"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "apps/shell/src"),
      "@shipay/design-system": path.resolve(__dirname, "packages/design-system/src"),
      "@shipay/types": path.resolve(__dirname, "packages/types/src"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
});
