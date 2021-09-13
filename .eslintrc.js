module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  rules: {
    'import/noUnresolved': 0,
    'import/extensions': ['error', 'always', {
      ts: 'never',
      js: 'never',
    }],
  },
  overrides: [{
    files: ['src/**'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: 'tsconfig.json',
      sourceType: 'module',
    },
    extends: [
      'airbnb-base-typescript',
    ],
  }, {
    // jest
    files: [
      'test/**/*.ts',
      'jest.setup.js',
    ],
    parserOptions: {
      project: 'tsconfig.json',
      sourceType: 'module',
    },
    env: {
      jest: true,
    },
    extends: [
      'plugin:jest/recommended',
      'plugin:jest/style',
    ],
    rules: {
      // development dependencies are hoisted to the root
      'import/no-extraneous-dependencies': 'off',
      'no-console': 'off',
    },
  }],
};
