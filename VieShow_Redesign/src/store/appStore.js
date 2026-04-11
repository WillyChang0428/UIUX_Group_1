// src/store/appStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  // 記錄是否正在切換頁面
  const isRouting = ref(false);

  return {
    isRouting
  };
});