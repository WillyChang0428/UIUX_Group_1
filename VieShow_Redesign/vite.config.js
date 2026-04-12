import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 1. 引入路徑模組，用來設定路徑別名

export default defineConfig({
  plugins: [vue()],

  base: '/UIUX_Group_1/',
  
  // 2. 設定路徑別名，讓 @ 指向 src 資料夾
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // 3. CSS 預處理器全域注入設定
  css: {
    preprocessorOptions: {
      scss: {
        // 1. 保留你之前的自動注入
        additionalData: `@use "@/assets/scss/_variables.scss" as v;`,
        
        // 2. 加入這行「安靜模式」
        // 這會忽略來自第三方套件 (dependencies) 的所有廢棄警告
        quietDeps: true,
        
        // 3. 在 2026 年，建議也加入這行，處理新的 Sass 現代 API 警告
        silenceDeprecations: ['color-functions', 'import', 'global-builtin'],
      }
    }
  }
})