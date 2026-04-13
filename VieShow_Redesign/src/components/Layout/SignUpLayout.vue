<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Header from "./Parts/Header/Header.vue";
import SignUpStepHeader from "./Parts/SignUpStepHeader.vue";

// ── 判斷是否為桌機的響應式變數 ──────────────────────────────
const isDesktop = ref(false);

const checkScreenSize = () => {
  // 🌟 修正：lg 尺寸在 Bootstrap 預設是 992px
  isDesktop.value = window.innerWidth >= 768;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<template>
  <div class="default-layout container">
    <Header v-if="isDesktop" />

    <SignUpStepHeader v-if="!isDesktop" />
    <SignUpStepHeader v-else />
    <main class="main-wrapper">
      <router-view />
    </main>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  @include media-breakpoint-up(md) {
    padding-top: v.$web-top-padding-pc-other;
    padding-bottom: v.$web-bottom-padding-pc-other;
  }
}
</style>
