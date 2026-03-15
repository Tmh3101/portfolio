import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import next from 'eslint-config-next';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', '.next', '.vercel', 'frontend', 'backend', 'node_modules']),
  {
    files: [
      'app/**/*.{js,jsx}',
      'components/**/*.{js,jsx}',
      'context/**/*.{js,jsx}',
      'features/**/*.{js,jsx}',
      'lib/**/*.{js,jsx}',
      'data/**/*.{js,jsx}',
      'middleware.js',
    ],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      next.configs.recommended,
      next.configs['core-web-vitals'],
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]|^motion$' }],
    },
  },
]);
