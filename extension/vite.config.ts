/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

export default defineConfig(async () => {
  // Dynamically load the ESM-only Tailwind-for-Vite plugin
  const { default: tailwind } = await import('@tailwindcss/vite');

  // RETURN the config object (was missing)
  return {
    root: __dirname,
    cacheDir: '../node_modules/.vite/extension',

    server: {
      host: '0.0.0.0',
      strictPort: true,
      port: 4200,
      cors: true,
      origin: 'http://localhost:4200',
      hmr: {
        host: 'localhost',
        port: 4200,
      },
    },

    preview: {
      host: 'localhost',
      port: 4200,
    },

    plugins: [
      react(),
      crx({ manifest }),
      tailwind(), // use the plugin
    ],

    // Uncomment if you add worker-specific plugins later
    // worker: {
    //   plugins: [nxViteTsPaths()],
    // },

    build: {
      outDir: './dist',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
});
