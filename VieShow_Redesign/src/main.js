import { createApp } from 'vue'
import './assets/scss/main.scss'
import 'bootstrap'
import App from './App.vue'
import vue3GoogleLogin from 'vue3-google-login'
import router from './router'

// 1. 先誕生 Vue 實體，並把它命名為 'app' (這樣第 7 行才找得到東西)
const app = createApp(App)

// 2. 裝備一：掛載 Router (導航地圖)
app.use(router)

// 3. 裝備二：掛載 Google 登入套件
app.use(vue3GoogleLogin, {
  clientId: '602491266867-qv4d6i11ajbu061g9scuejj2uk9846qo.apps.googleusercontent.com'
})

// 4. 裝備都穿好後，最後才推上戰場掛載到 HTML 上！
app.mount('#app')
