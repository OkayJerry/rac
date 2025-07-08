/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../node_modules/.vite/extension',
  server: {
    host: '0.0.0.0',        // listen on all interfaces
    strictPort: true,
    port: 4200,             // match the port in your dev manifest
    cors: true,             // permit the extension page to fetch HMR & assets :contentReference[oaicite:5]{index=5}
    origin: 'http://localhost:4200', // fix asset URLs inside the extension :contentReference[oaicite:6]{index=6}
    hmr: {
      host: 'localhost',
      port: 4200
    }
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  plugins: [react(), crx({ manifest })],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
