// @ts-check

import tseslint from 'typescript-eslint';

import fuzionRecommended from './eslint/recommended.js';

export default tseslint.config(
  {
    ignores: [
      '**/3rdparty/**/*',
      '**/*.js',
      '**/*.d.ts',
      '**/*.lit.css.ts'
    ],
  },
  ...fuzionRecommended,
);
