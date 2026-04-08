<!-- 這份檔案沒用 -->

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
  <div class="register-container">
    <h2>選擇註冊方式</h2>

    <div v-if="!userInfo" class="login-buttons">
      <GoogleLogin :callback="handleGoogleSuccess" />
    </div>

    <div v-else class="success-profile">
      <img :src="userInfo.picture" alt="Google 大頭貼" class="avatar" />
      <h3>註冊成功！歡迎，{{ userInfo.name }}</h3>
      <p>已綁定信箱：{{ userInfo.email }}</p>
    </div>
  </div>
</template>

<style scoped>
/* 稍微裝飾一下大頭貼，讓專題展示時更好看 */
.success-profile {
  text-align: center;
  margin-top: 2rem;
}
.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid #E50914; /* 影院主題紅 */
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}
</style>