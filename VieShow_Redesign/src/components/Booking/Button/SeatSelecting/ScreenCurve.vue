<template>
  <div class="screen-wrapper d-flex flex-column align-items-center">
    <div class="screen-curve"></div>
    <div class="screen-text fw-Regular mb-2">螢幕</div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.screen-curve {
  width: 80%;
  height: 32px;
  border: 3px solid transparent;
  border-top-color: $vieshow-warning;
  border-radius: 50%;
  margin-bottom: -16px;
  filter: drop-shadow(0px 0px 3px rgba($vieshow-warning, 0.9))
    drop-shadow(0px 4px 12px rgba($vieshow-warning, 0.6))
    drop-shadow(0px 8px 24px rgba($vieshow-warning, 0.3));
  display: block;
}

.screen-text {
  color: $vieshow-warning;
  margin-top: 4px;
  margin-bottom: 0;
  letter-spacing: 2px;
  font-size: var(--app-font-size-base);
  line-height: 1.2;
}
</style>