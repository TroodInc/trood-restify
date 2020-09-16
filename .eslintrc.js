module.exports = {
  parser: 'babel-eslint',
  extends: 'eslint:recommended',
  rules: {
    'no-var': 'error',
    'no-undef': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'max-len': ['error', {
      code: 120,
    }],
    semi: ['error', 'never'],
  },
}
