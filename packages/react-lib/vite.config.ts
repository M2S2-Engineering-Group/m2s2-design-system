import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-router', '@m2s2/tokens'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
    cssCodeSplit: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [resolve(__dirname, '../..')],
      },
    },
  },
});
