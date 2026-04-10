<template>
  <header class="booking-header">
    <div class="container-md p-0">
      <ul class="d-flex justify-content-between align-items-center booking-header__bar container-md">

        <li class="booking-header__side">
          <template v-if="step !== 5">
            <router-link v-if="backTo" :to="backTo" class="clickable-icon">
              <i class="fa-solid fa-angle-left text-secondary"></i>
            </router-link>
            <button v-else class="clickable-icon" @click="$emit('back')">
              <i class="fa-solid fa-angle-left text-secondary"></i>
            </button>
          </template>
          <span v-else class="clickable-icon"></span>
        </li>

        <li class="d-flex justify-content-center align-items-center flex-grow-1 position-relative">
          <p class="mb-0 text-white lh-relaxed booking-header__title">{{ currentTitle }}</p>
          <div v-if="step !== 5" class="position-absolute end-0 small booking-header__timer"
            :class="{ 'text-danger': isUrgent, 'booking-header__timer--urgent': isUrgent }">
            {{ formattedTime }}
          </div>
        </li>

        <li class="booking-header__side">
          <router-link v-if="closeTo" :to="closeTo" class="clickable-icon">
            <i class="fa-solid fa-xmark text-secondary"></i>
          </router-link>
          <button v-else class="clickable-icon" @click="$emit('close')">
            <i class="fa-solid fa-xmark text-secondary"></i>
          </button>
        </li>

      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  // 目前步驟：1=選擇票種 2=選擇座位 3=加購餐點 4=發票選擇 5=訂單完成
  step: {
    type: Number,
    default: 1,
    validator: (v) => [1, 2, 3, 4, 5].includes(v),
  },
  backTo: { type: String, default: null },
  closeTo: { type: String, default: null },
  totalSeconds: { type: Number, default: 600 },
});

defineEmits(['back', 'close', 'timeout']);

// ── 步驟標題 ───────────────────────────────────────────────────
const stepTitles = {
  1: '選擇票種',
  2: '選擇座位',
  3: '加購餐點',
  4: '發票選擇',
  5: '訂單完成',
};

const currentTitle = computed(() => stepTitles[props.step] ?? '購票流程');

// ── 倒數計時（訂單完成頁不啟動）───────────────────────────────
const secondsLeft = ref(props.totalSeconds);
let timer = null;

const formattedTime = computed(() => {
  const m = Math.floor(secondsLeft.value / 60).toString().padStart(2, '0');
  const s = (secondsLeft.value % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
});

const isUrgent = computed(() => secondsLeft.value <= 60);

onMounted(() => {
  if (props.step === 5) return;         // 訂單完成頁不倒數
  timer = setInterval(() => {
    if (secondsLeft.value <= 0) {
      clearInterval(timer);
      return;
    }
    secondsLeft.value--;
  }, 1000);
});

onUnmounted(() => { clearInterval(timer); });
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

// ── 💡 新增：固定在頂部的外層容器 ────────────────────────────────
.booking-header {
  position: fixed;
  top: v.$web-top-padding-mobile;
  left: 0;
  right: 0;
  height: fit-content;
  display: flex;
  align-items: center;
  z-index: 1030; // Bootstrap 標準 top header 的 z-index
  background-color: v.$vieshow-dark;
  border-bottom: 1px solid rgba($white, 0.05);
  @include v.media-breakpoint-up(md) {
    top: v.$web-top-padding-pc;
  }
}


// ── Header bar ─────────────────────────────────────────────────
.booking-header__bar {
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 36pt 0 var(--gap-lg);
  @include v.media-breakpoint-up(md) {
    padding: 16pt var(--gap-lg);
  }
}

// ── 左右側按鈕容器（固定寬，讓標題真正置中）──────────────────
.booking-header__side {
  flex-shrink: 0;
  width: $touch-target-size; // 45px，與 main.scss .clickable-icon 一致
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

// ── 標題 ─────────────────────────
.booking-header__title {
  font-size: var(--app-font-size-base);
  font-weight: $font-weight-bold;
  letter-spacing: $letter-spacing-wide;
}

// ── 計時器 ─────────────────────────────────────────────────────
.booking-header__timer {
  font-weight: $font-weight-bold;
  color: $vieshow-danger;
  letter-spacing: $letter-spacing-wide;

  &--urgent {
    animation: blink 1s step-start infinite;
  }
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}
</style>