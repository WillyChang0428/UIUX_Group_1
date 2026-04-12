import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: './', // 保持相對路徑

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    rollupOptions: {
      output: {
        // 🌟 這裡做了 null 檢查 (chunk.name || 'chunk')
        // 確保即便檔案沒名字，也不會噴錯誤，且一定會去掉底線
        chunkFileNames: (chunk) => {
          const name = (chunk.name || 'chunk').replace(/^_+/, '');
          return `assets/${name}-[hash].js`;
        },
        entryFileNames: (chunk) => {
          const name = (chunk.name || 'index').replace(/^_+/, '');
          return `assets/${name}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          // 資源檔案通常比較穩定，我們直接用內建變數避開底線
          // 如果真的還有底線檔案，GitHub Pages 會被 .nojekyll 擋住保險
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/scss/_variables.scss" as v;`,
        quietDeps: true,
        silenceDeprecations: ['color-functions', 'import', 'global-builtin'],
      }
    }
  }
})