<template>
  <Transition name="fade">
    <div v-if="modelValue" class="panorama-overlay">
      <button class="panorama-close" @click="$emit('update:modelValue', false)" aria-label="關閉實景">
        <i class="fa-solid fa-xmark fs-4"></i>
      </button>
      <div class="panorama-hint">
        <i class="fa-solid fa-arrows-up-down-left-right"></i>
        <span>拖曳移動查看 360° 實景</span>
      </div>
      <div
        class="panorama-viewport"
        @mousedown="onPanStart" @mousemove="onPanMove" @mouseup="onPanEnd" @mouseleave="onPanEnd"
        @touchstart.prevent="onTouchStart" @touchmove.prevent="onTouchMove" @touchend="onPanEnd"
      >
        <div class="panorama-360-bg"
          :style="{ backgroundImage: `url(${image})`, backgroundPosition: `${panX}px center` }">
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  modelValue: { type: Boolean, default: false },
  image: { type: String, required: true }
});
defineEmits(['update:modelValue']);

// ── 實景環景拖曳邏輯 ──
const panX = ref(0);
let isPanning = false;
let startX = 0;
let startPanX = 0;

const getPointerPos = (e) => e.touches ? e.touches[0] : e;

const onPanStart = (e) => {
  isPanning = true;
  startX = getPointerPos(e).clientX;
  startPanX = panX.value;
};

const onPanMove = (e) => {
  if (!isPanning) return;
  const dx = (getPointerPos(e).clientX - startX) * 1.5;
  panX.value = startPanX + dx;
};

const onPanEnd = () => isPanning = false;
const onTouchStart = onPanStart;
const onTouchMove = onPanMove;
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.panorama-overlay {
  position: absolute;
  inset: 0;
  background: $black;
  z-index: 120;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panorama-360-bg {
  width: 100%;
  height: 100%;
  background-size: auto 100%;
  background-repeat: repeat-x;
  will-change: background-position;
  transition: background-position 0.05s linear;
}

.panorama-viewport {
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: grab;
  &:active {
    cursor: grabbing;
    .panorama-360-bg { transition: none; }
  }
}

.panorama-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 1px solid rgba($white, 0.3);
  background: rgba($black, 0.6);
  color: $light;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 21;
}

.panorama-hint {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba($black, 0.55);
  border-radius: 999px;
  padding: 4px 12px;
  color: rgba($white, 0.75);
  font-size: var(--app-font-size-mini);
  z-index: 21;
  pointer-events: none;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>