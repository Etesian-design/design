/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: { entry: resolve(__dirname, 'src/index.ts'), name: 'Harmattan', fileName: 'harmattan' },
    cssFileName: 'harmattan',
    rollupOptions: { external: ['vue'], output: { globals: { vue: 'Vue' }, assetFileNames: 'harmattan.[ext]' } },
  },
  test: { environment: 'jsdom', include: ['tests/**/*.test.ts'], alias: [{ find: /^quasar$/, replacement: 'quasar/dist/quasar.client.js' }], css: false, setupFiles: ['tests/setup.ts'] },
});
