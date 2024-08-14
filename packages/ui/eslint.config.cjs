const airbnbBase = require('eslint-config-airbnb-base');
const prettierConfig = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');
const reactPlugin = require('eslint-plugin-react');
const prettierPlugin = require('eslint-plugin-prettier');
const babelParser = require('@babel/eslint-parser');

module.exports = [
  {
    files: ['**/*.js', '**/*.jsx'],
    ignores: ['node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
    },
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...airbnbBase.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      'import/prefer-default-export': 'off',
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      'no-console': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
