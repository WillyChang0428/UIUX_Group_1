import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  
  // 保持相對路徑，這是目前最穩定的設定
  base: '/UIUX_Group_1/', 
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    rollupOptions: {
      output: {
        // 🌟 修正後的 JS 檔名規則
        chunkFileNames: (chunk) => {
          const name = (chunk.name || 'chunk').replace(/^_+/, '');
          return `assets/${name}-[hash].js`;
        },
        entryFileNames: (chunk) => {
          // 修正點：這裡原本寫成了 ${name] ，現在改回 ${name}
          const name = (chunk.name || 'index').replace(/^_+/, '');
          return `assets/${name}-[hash].js`;
        },
        // 資源檔案直接使用字串格式，最安全
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/scss/_variables.scss" as v;`,
        quietDeps: true,
      }
    }
  }
})