import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: ["vue", "@m2s2/tokens", "@m2s2/models"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        globals: { vue: "Vue" },
      },
    },
    cssCodeSplit: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [resolve(__dirname, "../..")],
      },
    },
  },
});
