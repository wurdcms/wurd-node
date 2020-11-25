import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import eslint from '@rollup/plugin-eslint';
import pkg from './package.json';

const globals = {
  'node-fetch': 'window.fetch',
  'lru-cache': 'LRU',
  'fs': 'fs',
};

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: [
      {
        name: 'wurd',
        file: pkg.browser,
        format: 'umd',
        plugins: [filesize()],
        globals,
      },
      {
        name: 'wurd',
        file: 'dist/wurd.min.js',
        format: 'umd',
        plugins: [uglify()],
        globals,
      },
    ],
    external: ['node-fetch', 'lru-cache', 'fs'],
    plugins: [
      eslint(),
      resolve({ // so Rollup can find node modules
        browser: true,
      }),
      commonjs(), // so Rollup can convert node modules to ES modules
      babel({
        // This ensures dependencies are transpiled as well
        exclude: [],
        babelrc: false,
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-class-properties'],
      }),
    ],
  },

  // ES module (for bundlers) build.
  {
    input: 'src/index.js',
    external: ['get-property-value', 'marked', 'node-fetch', 'lru-cache', 'fs'],
    output: {
      file: pkg.module,
      format: 'es'
    },
    plugins: [
      resolve({ // so Rollup can find node modules
        browser: true,
      }),
      commonjs(), // so Rollup can convert node modules to ES modules
    ],
  }
];
