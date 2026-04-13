<script setup>
import { defineEmits } from 'vue';
import { jwtDecode } from 'jwt-decode';

const emit = defineEmits(['success']);

const handleGoogleSuccess = (response) => {
  try {
    const token = response.credential;
    const decodedData = jwtDecode(token);
    const data = {
      name: decodedData.name,
      email: decodedData.email,
      picture: decodedData.picture
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
      width="192" 
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.google-btn-custom-wrapper {
  // 這裡套用你原本的設計規範
  width: 192.14px;  // 🌟 保持你設定的精確寬度
  height: 40px;     // 🌟 保持高度
  border-radius: var(--app-radius);
  overflow: hidden; // 確保按鈕不會超出圓角
  
  display: flex;
  justify-content: center;
  align-items: center;

  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    background-color: rgba($vieshow-secondary, 0.1);
  }
}

// 深度選擇器，確保 Google 內部的按鈕稍微對齊
:deep(.S67qz-I097p) {
  border-radius: var(--app-radius) !important;
}
</style>
