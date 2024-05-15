// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: {
    overrides: {
      'ts/consistent-type-exports': 'off',
      'ts/consistent-type-imports': 'off',
    },
  },
  react: true,
  jsx: true,
  rules: {
    'curly': 'off',
    'no-console': 'off',
  },
})
