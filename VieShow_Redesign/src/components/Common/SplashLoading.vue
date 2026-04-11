<template>
  <transition name="splash-fade">
    <div v-if="isVisible" class="splash-screen">
      <div class="logo-group" :class="{ 'is-shrinking-up': currentStep >= 3 }">
        
        <div class="logo-icon-wrapper">
          <img
            src="@/assets/images/SvgLogo.svg"
            class="logo-img track-logo"
            alt="Vieshow Track"
          />
          
          <div
            class="logo-img gradient-logo"
            :class="{ 'is-filling': currentStep >= 1 }"
          ></div>
        </div>

        <div class="logo-text" :class="{ 'fade-in': currentStep >= 2 }">
          <img src="@/assets/images/FontLogo.png" alt="font-logo" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isVisible = ref(true);
const currentStep = ref(0);

onMounted(() => {
  document.body.style.overflow = "hidden";

  // Step 1: 0.1秒後，開始由下而上「漸層流動填滿」
  setTimeout(() => { currentStep.value = 1; }, 100);

  // Step 2: 1.2秒後，文字淡入 (此時剛好填滿)
  setTimeout(() => { currentStep.value = 2; }, 1700);

  // Step 3: 2.0秒後，整組往上飛並縮小
  setTimeout(() => { currentStep.value = 3; }, 2500);

  // Step 4: 2.8秒後，黑色背景淡出，動畫結束
  setTimeout(() => {
    isVisible.value = false;
    document.body.style.overflow = ""; 
  }, 3300);
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.splash-screen {
  position: fixed;
  inset: 0;
  background-color: $vieshow-dark;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-md);
  transition: transform 0.8s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.5s ease;
  transform: translateY(0) scale(1);

  &.is-shrinking-up {
    transform: translateY(-40vh) scale(0.4);
    opacity: 0; 
  }
}

.logo-icon-wrapper {
  position: relative;
  width: 100px; 
  height: 80px;
}

.logo-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* ⚪ 底層軌道：給它一點透明度，看起來像還沒裝水的空模具 */
.track-logo {
  object-fit: contain;
  opacity: 0.15; 
}

/* 🌊 漸層流動層：核心魔術 */
.gradient-logo {
  /* 1. 畫出您圖片中的漸層背景 */
  background: linear-gradient(90deg, #2660A9 0%, #2F96EE 100%);
  
  /* 2. 把 SVG 當作遮罩，讓漸層只顯示在 W 形狀內 */
  -webkit-mask-image: url('@/assets/images/SvgLogo.svg');
  -webkit-mask-size: contain;
  -webkit-mask-position: center;
  -webkit-mask-repeat: no-repeat;
  
  /* 標準語法相容 */
  mask-image: url('@/assets/images/SvgLogo.svg');
  mask-size: contain;
  mask-position: center;
  mask-repeat: no-repeat;

  /* 3. 水位上升動畫 (clip-path) */
  clip-path: inset(100% 0 0 0);
  transition: clip-path 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &.is-filling {
    clip-path: inset(0 0 0 0); /* 填滿！ */
  }
}

.logo-text {
  height: 35px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.6s ease;

  &.fade-in {
    opacity: 1;
    transform: translateY(0);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.splash-fade-leave-active {
  transition: opacity 0.5s ease;
}
.splash-fade-leave-to {
  opacity: 0;
}
</style>