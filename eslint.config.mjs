import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.FlatConfig} */
export default [
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.browser, // 브라우저 글로벌 변수
    },
    plugins: {
      '@eslint/js': pluginJs,
    },
    rules: {
      'no-unused-vars': 'warn', // 사용되지 않는 변수에 경고
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser, // TypeScript 파서 사용
      globals: globals.browser, // 브라우저 글로벌 변수
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
      ], // TypeScript에서 사용되지 않는 변수에 경고
    },
  },
];
