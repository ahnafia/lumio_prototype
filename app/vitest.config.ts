import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// App unit tests: `npx vitest run --config app/vitest.config.ts`.
// The shared root config only includes contract tests, and is shared, so app tests get their own config.
export default defineConfig({
  resolve: { alias: { '@contract': fileURLToPath(new URL('../contract', import.meta.url)) } },
  test: { root: fileURLToPath(new URL('.', import.meta.url)), include: ['**/*.test.ts'], environment: 'node' },
});
