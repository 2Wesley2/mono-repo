export default {
  root: true,
  extends: ['./packages/api/eslint.config.cjs', 'plugin:json/recommended'],
  overrides: [
    {
      files: ['*.json'],
      parser: 'json-eslint-parser',
      rules: {
        'json/*': ['error', { allowComments: false }]
      }
    }
  ]
};
