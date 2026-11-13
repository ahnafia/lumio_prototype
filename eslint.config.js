// Shared config: changing it needs both cofounders to approve (see CONTRIBUTING.md).
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** Forbid importing from the given top-level folders. This enforces the A/B split. */
function forbid(folders, message) {
  return {
    'no-restricted-imports': [
      'error',
      { patterns: [{ group: folders.flatMap((f) => [`**/${f}`, `**/${f}/**`]), message }] },
    ],
  };
}

export default defineConfig(
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['**/*.{js,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  // ---- Folder boundaries: the contract is the only thing the halves share ----
  {
    files: ['app/**'],
    rules: forbid(
      ['content', 'animations'],
      'app/ (Cofounder A) imports only from @contract/*. Lessons and animations reach the app through @contract/load.',
    ),
  },
  {
    files: ['content/**'],
    rules: forbid(['app', 'animations'], 'content/ (Cofounder B) imports only from @contract/*.'),
  },
  {
    files: ['animations/**'],
    rules: forbid(['app', 'content'], 'animations/ (Cofounder B) imports only from @contract/* and animations/.'),
  },
  {
    files: ['contract/**'],
    rules: forbid(
      ['app'],
      'contract/ must not depend on the app. It reaches content/ and animations/ only through import.meta.glob in load.ts.',
    ),
  },
);
