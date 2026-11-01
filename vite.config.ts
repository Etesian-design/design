/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  plugins: [vue()],
  test: { environment: 'jsdom', include: ['tests/**/*.test.ts'], alias: [{ find: /^quasar$/, replacement: 'quasar/dist/quasar.client.js' }], css: false, setupFiles: ['tests/setup.ts'] },
});
