/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: { entry: resolve(import.meta.dirname, 'src/index.ts'), name: 'Etesian', fileName: 'etesian' },
    cssFileName: 'etesian',
    rollupOptions: { external: ['vue'], output: { globals: { vue: 'Vue' }, assetFileNames: 'etesian.[ext]' } },
  },
  test: { environment: 'jsdom', include: ['tests/**/*.test.ts'], alias: [{ find: /^quasar$/, replacement: 'quasar/dist/quasar.client.js' }], css: false, setupFiles: ['tests/setup.ts'] },
});
