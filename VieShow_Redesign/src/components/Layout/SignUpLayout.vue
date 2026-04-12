<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Header from './Parts/Header/Header.vue';
import SignUpStepHeader from './Parts/SignUpStepHeader.vue';

// ── 判斷是否為桌機的響應式變數 ──────────────────────────────
const isDesktop = ref(false);

const checkScreenSize = () => {
  // 🌟 修正：lg 尺寸在 Bootstrap 預設是 992px
  isDesktop.value = window.innerWidth >= 992; 
};

onMounted(() => {
  checkScreenSize(); 
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<template>
  <div class="default-layout container">
    <Header v-if="isDesktop" />

    <SignUpStepHeader v-if="!isDesktop" />
    <SignUpStepHeader v-else /> <main 
      class="layout-main" 
      :class="isDesktop ? 'other-wrapper' : 'main-wrapper'"
    >
      <router-view />
    </main>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;

  // 🌟 手機版：只有一個 SignUpStepHeader
  &.main-wrapper {
    padding-top: $web-top-padding-mobile; 
  }

  // 🌟 電腦版：Header (1倍) + SignUpStepHeader (1倍) = 2倍高度
  &.other-wrapper {
    // 使用 calc 確保剛好是兩個標頭的高度，照片就不會被吃掉
    padding-top: calc($web-top-padding-pc * 2); 
  }
}
</style>