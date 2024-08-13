const path = require('path');
const airbnbBase = require('eslint-config-airbnb');
const prettierConfig = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');
const prettierPlugin = require('eslint-plugin-prettier');
const reactPlugin = require('eslint-plugin-react');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const reactHooksPlugin = require('eslint-plugin-react-hooks');

module.exports = [
  {
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2021, // Utilize a versão mais recente disponível
      globals: {
        React: 'readonly',
      },
    },
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      'import/prefer-default-export': 'off',
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      'no-console': 'off',
    },
  },
  // Regras do Airbnb
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021, // Utilize a versão mais recente disponível
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      'jsx-a11y': jsxA11yPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...airbnbBase.rules,
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
      'react/react-in-jsx-scope': 'off',
    },
  },
  // Regras do Prettier
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          printWidth: 120,
          tabWidth: 2,
          bracketSpacing: true,
          endOfLine: 'lf',
        },
      ],
    },
  },
];
