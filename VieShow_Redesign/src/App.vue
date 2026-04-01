<script setup>
import { ref } from 'vue';
import ProgressStep from './components/Common/ProgressStep.vue';
import SecondaryButton from './components/Common/Button/SecondaryButton.vue';

// 💡 必須在父層定義響應式變數
const currentStep = ref(1);
const totalSteps = 4;
</script>

<template>
  <ProgressStep :currentStep="currentStep" :totalSteps="totalSteps" />

  <div class="d-flex gap-3 mt-4">
    <SecondaryButton @click="currentStep > 1 && currentStep--" :isDisabled="currentStep <= 1">上一步</SecondaryButton>

    <SecondaryButton @click="currentStep < totalSteps && currentStep++" :isDisabled="currentStep >= totalSteps">下一步
    </SecondaryButton>
  </div>
</template>

<style lang="scss">
/* 你的全域樣式 */
body {
  height: 100vh;
  background: v.$vieshow-gradient-dark;
  padding: 133px 0 0;
  /* 預留 Header 的高度 */
}
</style>
