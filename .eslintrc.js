module.exports = {
  parser: 'babel-eslint',
  extends: 'eslint:recommended',
  rules: {
    'no-var': 'error',
    'no-undef': 'off',
    'comma-dangle': ['error', 'always'],
    'max-len': [
      2,
      {
        code: 120,
      }
    ],
    semi: [
      2,
      'never',
    ],
  },
}
