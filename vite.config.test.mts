// vite.config.test.mts

import { defineConfig } from 'vite';
import path from 'path';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

// This config swaps the real library with our mock during the test build.
export default defineConfig({
  build: {
    minify: false,
  },
  resolve: {
    alias: {
      'client-vector-search': path.resolve(__dirname, 'tests/mocks/client-vector-search.ts')
    }
  },
  plugins: [ crx({ manifest }) ],
});