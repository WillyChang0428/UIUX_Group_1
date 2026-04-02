<template>
  <header class="header-bg fixed-top">
    <div class="container d-flex justify-content-between align-items-center">
      <div class="clickable-icon h2" @click="isMenuOpen = !isMenuOpen">
        <i
          :class="[
            'fa-solid',
            isMenuOpen ? 'fa-xmark' : 'fa-bars',
            'text-white',
          ]"
        ></i>
      </div>

      <div class="logo-wrapper">
        <img src="@/assets/images/LOGO.png" alt="Logo" class="img-fluid" />
      </div>

      <div class="clickable-icon h2">
        <i class="fa-solid fa-user text-white"></i>
      </div>
    </div>
  </header>

  <NavMenu :show="isMenuOpen" @close="isMenuOpen = false" />
</template>

<script setup>
import { ref } from "vue";
import NavMenu from "./NavMenu.vue";

const isMenuOpen = ref(false);
</script>

<style scoped lang="scss">
.header-bg {
  // 💡 使用 v. 前綴呼叫 SCSS 漸層變數 [cite: 95, 138]
  background: v.$vieshow-gradient-primary;
  width: 100%;
  padding-top: var(--gap-2xl);

  // 💡 呼叫手冊中定義好的全域導航欄高度變數
  // 手機版自動 134px / 電腦版自動 86px
  height: v.$web-top-padding-mobile;

  @include v.media-breakpoint-up(md) {
    height: v.$web-top-padding-pc;
    padding: 0;
  }

  display: flex;
  align-items: center;
  z-index: 1050; // Bootstrap fixed-top 預設值
}

.logo-wrapper {
  // 💡 根據設計規範，建議寬度也使用比例或變數控制
  width: 158px;
  // height: 86px; // 移除寫死高度，讓 img-fluid 根據寬度自適應

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
