const eslintPluginPrettier = require('eslint-plugin-prettier');
const eslintPluginNext = require(
  require.resolve('eslint-plugin-next', { paths: [__dirname] }),
);

module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  {
    plugins: {
      prettier: eslintPluginPrettier,
      next: eslintPluginNext,
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      'prettier/prettier': 'error',
    },
    extends: ['plugin:prettier/recommended', 'next/core-web-vitals'],
  },
];
