/// <reference types="vitest" />

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name]` + Date.now() + `.js`,
        chunkFileNames: `[name]` + Date.now() + `.js`,
        assetFileNames: `[name]` + Date.now() + `.[ext]`,
      },
    },
  },
  test: {
    // ...
  },
});
