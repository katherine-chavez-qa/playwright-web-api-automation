// @ts-check
import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import playwright from 'eslint-plugin-playwright';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['node_modules/', 'playwright-report/', 'test-results/', 'blob-report/']),

  eslint.configs.recommended,

  // Type-aware rules catch Playwright's most common bug: a missing `await`.
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Plain JS config files are not part of tsconfig, so skip type-aware rules for them.
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  // Playwright rules only make sense where tests live, not in page objects.
  {
    files: ['tests/**/*.ts'],
    extends: [playwright.configs['flat/recommended']],
  },

  // Must stay last: turns off stylistic rules that would fight with Prettier.
  prettier,
);
