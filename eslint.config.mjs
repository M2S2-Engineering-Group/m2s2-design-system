import tseslint from 'typescript-eslint';
import angularPlugin from '@angular-eslint/eslint-plugin';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

// Collect all rules from eslint-plugin-vue flat/recommended config chain
const vueRules = Object.assign(
  {},
  ...vuePlugin.configs['flat/recommended'].filter(c => c.rules).map(c => c.rules),
);

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/out-tsc/**',
      'packages/storybook-shared/**',
      '.storybook/**',
      '**/*.stories.ts',
      '**/*.stories.tsx',
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.test.vue',
      '**/test/**',
    ],
  },

  // ── TypeScript: all packages ──────────────────────────────────────────────
  {
    files: ['packages/**/*.ts', 'packages/**/*.tsx'],
    extends: [tseslint.configs.recommended],
  },

  // ── Angular TypeScript ────────────────────────────────────────────────────
  {
    files: ['packages/ng-lib/src/**/*.ts'],
    plugins: { '@angular-eslint': angularPlugin },
    rules: {
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/directive-class-suffix': 'error',
      '@angular-eslint/contextual-lifecycle': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/no-input-rename': 'warn',
      '@angular-eslint/no-inputs-metadata-property': 'error',
      '@angular-eslint/no-output-native': 'error',
      '@angular-eslint/no-output-on-prefix': 'warn',
      '@angular-eslint/no-output-rename': 'warn',
      '@angular-eslint/no-outputs-metadata-property': 'error',
    },
  },

  // ── Angular HTML templates ────────────────────────────────────────────────
  {
    files: ['packages/ng-lib/src/**/*.html'],
    languageOptions: { parser: angularTemplateParser },
    plugins: { '@angular-eslint/template': angularTemplatePlugin },
    rules: {
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/no-duplicate-attributes': 'error',
    },
  },

  // ── React ─────────────────────────────────────────────────────────────────
  {
    files: ['packages/react-lib/src/**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },

  // ── Vue SFCs ──────────────────────────────────────────────────────────────
  {
    files: ['packages/vue-lib/src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tseslint.parser },
    },
    plugins: { vue: vuePlugin },
    processor: vuePlugin.processors['.vue'],
    rules: {
      ...vueRules,
      'vue/multi-word-component-names': 'off',
    },
  },
);
