import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
// Second library entry: etesian-design/quasar (ES module; vue + quasar external).
export default defineConfig({
  plugins: [vue()],
  build: {
    emptyOutDir: false,
    lib: { entry: resolve(import.meta.dirname, 'src/quasar/index.ts'), formats: ['es'], fileName: () => 'quasar.js' },
    cssFileName: 'quasar-components',
    rollupOptions: { external: ['vue', 'quasar'] },
  },
});
