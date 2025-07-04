// vite.config.mts

import { defineConfig } from 'vite';
import path from 'path';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
// We are no longer using the static copy plugin for this test.
// import { viteStaticCopy } from 'vite-plugin-static-copy'; 

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  build: {
    minify: false,
    sourcemap: false, // 👈 Add this line to disable sourcemaps
  },
  plugins: [
    crx({ manifest }),
    // We are disabling this for now to simplify the build.
    /*
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/onnxruntime-web/dist/*.wasm',
          dest: '.' 
        }
      ]
    })
    */
  ],
});