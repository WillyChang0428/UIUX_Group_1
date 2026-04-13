<script setup>
import { defineEmits, defineProps } from 'vue'; // 🌟 引入 defineProps
import { jwtDecode } from 'jwt-decode';

// 🌟 新增 Props，讓外部可以控制寬度
const props = defineProps({
  width: {
    type: [String, Number],
    default: 192 // 預設值保持和你原本設計的一樣
  }
});

const emit = defineEmits(['success']);

const handleGoogleSuccess = (response) => {
  try {
    const token = response.credential;
    const decodedData = jwtDecode(token);
    const data = {
      name: decodedData.name,
      email: decodedData.email,
      picture: decodedData.picture,
      credential: response.credential // 🌟 記得把這個傳回去，LoginView 需要它來執行分流
    };
    emit('success', data);
  } catch (error) {
    console.error('解密失敗:', error);
  }
};
</script>

<template>
  <div class="google-btn-custom-wrapper">
    <GoogleLogin 
      :callback="handleGoogleSuccess" 
      popup-type="CODE"
      :width="width" 
    />
  </div>
</template>

<style lang="scss" scoped>
.google-btn-custom-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  min-height: 40px;

  /* 🌟 核心修正：只針對 Google 的「按鈕本體」class，不要針對所有的 div */
  :deep(.nsm7Bb-HzV7m-LgbsSe) {
    width: 100% !important;
    max-width: 100% !important;
    border-radius: var(--app-radius) !important;
  }

  /* 🌟 針對 iframe 確保它是滿的 */
  :deep(iframe) {
    width: 100% !important;
    left: 0 !important;
    position: relative !important;
  }
}
</style>