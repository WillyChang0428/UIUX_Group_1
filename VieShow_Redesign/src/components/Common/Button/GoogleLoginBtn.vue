<script setup>
import { ref } from 'vue'
// 引入解密 JWT 的魔術工具
import { jwtDecode } from 'jwt-decode'

// 準備一個變數來裝解密後的資料
const userInfo = ref(null)

// 當使用者點擊授權成功後，Google 會觸發這個函式
const handleGoogleSuccess = (response) => {
  // 1. 攔截 Google 回傳的加密憑證 (Credential)
  const token = response.credential
  
  // 2. 直接在前端解密！
  const decodedData = jwtDecode(token)
  
  // 3. 把我們需要的資料抓出來存進變數
  userInfo.value = {
    name: decodedData.name,       // 真實姓名
    email: decodedData.email,     // 信箱
    picture: decodedData.picture  // Google 頭像網址
  }
  
  console.log('Google 登入成功！抓到的資料：', userInfo.value)
  // 這裡你可以加上 router.push('/home') 讓他跳轉回首頁
}
</script>

<template>
  <div>
    <GoogleLogin :callback="handleGoogleSuccess" class="google-btn" />
  </div>
</template>



<style lang="scss" scoped>
.google-btn {
    color: v.$vieshow-primary;
    border-radius: var(--app-radius);
    font-size: var(--app-font-size-base);
    transition: all 0.2s ease;
    overflow: hidden;

    // &:hover {
    //   // 💡 取代死白的 #F0F0F0，改用具語意化的 rgba 輔助色
    //   background-color: rgba(v.$vieshow-secondary, 0.1) !important;
    // }
  }
</style>