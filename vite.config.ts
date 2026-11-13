import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Shared config: changing it needs both cofounders to approve (see CONTRIBUTING.md).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@contract': fileURLToPath(new URL('./contract', import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      // Two pages: the app (A) and the animation gallery (B).
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        gallery: fileURLToPath(new URL('./gallery.html', import.meta.url)),
      },
    },
  },
  test: {
    include: ['contract/**/*.test.ts'],
    environment: 'node',
  },
});
