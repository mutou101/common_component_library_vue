/**
 * Library build — produces ESM + UMD bundles for publishing the component library.
 * Run: npm run build:lib
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'CommonComponentLibraryVue',
      fileName: (format) => `common-component-library-vue.${format === 'es' ? 'mjs' : 'umd.js'}`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        exports: 'named',
        assetFileNames: 'common-component-library-vue.[ext]',
      },
    },
    outDir: 'dist-lib',
  },
})
