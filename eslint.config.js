import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx'],
        },
      },
    },
    plugins: {
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,

      // 允许“有意为空”的 catch 块（用于 feature-detect / 用户取消等可接受失败）
      'no-empty': ['error', { allowEmptyCatch: true }],

      // Vite alias（@/ 等）会让该规则产生误报，交给 TypeScript 或构建期处理更合适
      'import/no-unresolved': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',

      // 项目为 JS/JSX，避免强推 PropTypes
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      // React Compiler 相关建议规则目前过于激进，会把正常写法当成错误
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/set-state-in-effect': 'off',

      // 允许 warn/error（用于错误边界/开发期诊断），禁止 console.log
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // 轻量提升 JSX 质量（警告级别，不阻塞 CI）
      'react/jsx-no-useless-fragment': 'warn',
    },
  },
  eslintConfigPrettier,
];
