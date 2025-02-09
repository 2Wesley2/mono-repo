const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = {
  root: true,
  parser: '@babel/eslint-parser', // Adicionado para suportar sintaxe moderna
  parserOptions: {
    requireConfigFile: false // Adicionado para suportar sintaxe moderna
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
      parser: '@babel/eslint-parser', // Atualizado
      parserOptions: {
        requireConfigFile: false // Adicionado
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
      plugins: [], // Corrigido para ser um array vazio
      rules: {}
    },
    {
      files: ['**/*.js'],
      plugins: ['prettier'], // Corrigido para ser um array
      rules: {
        ...prettierConfig.rules,
        'prettier/prettier': 'error'
      }
    },
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser', // Adicionado
      plugins: ['@typescript-eslint'], // Corrigido para ser um array
      rules: {
        ...tsPlugin.configs.recommended.rules
      }
    },
    {
      files: ['**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        ...tsPlugin.configs.recommended.rules
      }
    }
  ]
};
