<template>
  <header class="header-wrapper fixed-top">
    <div class="container">
      <div
        class="navigation-bar d-flex justify-content-between align-items-center"
      >
        <div
          class="arrow_back d-flex justify-content-center align-items-center clickable-icon"
        >
          <i class="fa-solid fa-angle-left"></i>
        </div>

        <div class="title fw-bold">分頁標題</div>

        <div
          class="close_icon d-flex justify-content-center align-items-center clickable-icon"
        >
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup></script>

<style scoped lang="scss">
/* 💡 引入變數地基，下方全面拔除 v. 前綴 */
@import "@/assets/scss/variables";

.header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1030; // 💡 配合 Bootstrap 的預設 z-index
  background-color: $vieshow-dark;
  border-bottom: 1px solid rgba($white, 0.05);
  @include media-breakpoint-up(md) {
    top: v.$web-top-padding-pc;
  }
}

.navigation-bar {
  width: 100%;
  // 💡 使用變數來控制上下間距
  padding: 48px 0 var(--gap-lg);

  @include media-breakpoint-up(md) {
    padding: 16px 0;
  }
}

.arrow_back,
.close_icon {
  width: $touch-target-size; // 💡 對齊您規範的 45px 觸控熱區
  height: $touch-target-size;
  font-size: 24px;
  color: $vieshow-secondary;
  cursor: pointer;
  transition: opacity 0.2s ease;

  @include hover-focus {
    opacity: 0.7;
  }
}

.title {
  font-size: var(--app-font-size-base);
  font-weight: $font-weight-bold;
  letter-spacing: $letter-spacing-wide;
  color: v.$white;

}
</style>
