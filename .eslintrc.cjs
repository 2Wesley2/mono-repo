const prettierConfig = require('eslint-config-prettier');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false
  },
  extends: ['plugin:json/recommended'],
  plugins: ['json'],
  overrides: [
    {
      files: ['*.json'],
      rules: {
        'json/*': ['error', { allowComments: false }]
      }
    },
    {
      files: ['**/*.js'],
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false
      },
      rules: {
        'import/prefer-default-export': 'off',
        'no-underscore-dangle': 'off',
        'class-methods-use-this': 'off',
        'no-console': 'off'
      }
    },
    {
      files: ['**/*.js'],
      plugins: ['prettier'],
      rules: {
        ...prettierConfig.rules,
        'prettier/prettier': 'error'
      }
    },
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'prettier'],
      rules: {
        ...tsPlugin.configs.recommended.rules,
        'prettier/prettier': 'error'
      }
    },
    {
      files: ['**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'prettier'],
      rules: {
        ...tsPlugin.configs.recommended.rules,
        'prettier/prettier': 'error'
      }
    }
  ]
};
