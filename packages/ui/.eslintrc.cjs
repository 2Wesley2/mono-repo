module.exports = {
  extends: ['../../.eslintrc.cjs', 'plugin:react/recommended'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/prop-types': 'off'
  }
};
