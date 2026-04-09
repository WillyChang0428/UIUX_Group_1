<template>
  <div class="container-md">
    <ul class="d-flex justify-content-between align-items-center booking-header__bar">

      <!-- 左：返回按鈕（訂單完成頁隱藏，用空白佔位保持對齊） -->
      <li class="booking-header__side">
        <template v-if="step !== 5">
          <router-link v-if="backTo" :to="backTo" class="clickable-icon">
            <i class="fa-solid fa-angle-left text-secondary"></i>
          </router-link>
          <button v-else class="clickable-icon" @click="$emit('back')">
            <i class="fa-solid fa-angle-left text-secondary"></i>
          </button>
        </template>
        <!-- 訂單完成：佔位，讓標題維持置中 -->
        <span v-else class="clickable-icon"></span>
      </li>

      <!-- 中：標題 + 計時器 -->
      <li class="d-flex justify-content-center align-items-center flex-grow-1 position-relative">
        <!-- 標題 -->
        <p class="mb-0 text-light booking-header__title">{{ currentTitle }}</p>

        <!-- 倒數計時器（訂單完成頁不顯示） -->
        <div
          v-if="step !== 5"
          class="position-absolute end-0 booking-header__timer"
          :class="{ 'text-danger': isUrgent, 'booking-header__timer--urgent': isUrgent }"
        >
          {{ formattedTime }}
        </div>
      </li>

      <!-- 右：關閉按鈕（永遠顯示） -->
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

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
})

defineEmits(['back', 'close', 'timeout'])

// ── 步驟標題 ───────────────────────────────────────────────────
const stepTitles = {
  1: '選擇票種',
  2: '選擇座位',
  3: '加購餐點',
  4: '發票選擇',
  5: '訂單完成',
}

const currentTitle = computed(() => stepTitles[props.step] ?? '購票流程')

// ── 倒數計時（訂單完成頁不啟動）───────────────────────────────
const secondsLeft = ref(props.totalSeconds)
let timer = null

const formattedTime = computed(() => {
  const m = Math.floor(secondsLeft.value / 60).toString().padStart(2, '0')
  const s = (secondsLeft.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const isUrgent = computed(() => secondsLeft.value <= 60)

onMounted(() => {
  if (props.step === 5) return          // 訂單完成頁不倒數
  timer = setInterval(() => {
    if (secondsLeft.value <= 0) {
      clearInterval(timer)
      return
    }
    secondsLeft.value--
  }, 1000)
})

onUnmounted(() => { clearInterval(timer) })
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

// ── Header bar ─────────────────────────────────────────────────
// 使用 BS spacer class 控制間距，不寫死 px
.booking-header__bar {
  list-style: none;
  margin: 0;
  // 手機版：pt-8（72px）pb-3（16px）
  padding-top: var(--gap-4xl);
  padding-bottom: var(--gap-sm);
  padding-left: 0;
  padding-right: 0;

  @include media-breakpoint-up(md) {
    // PC 版：py-2（16px）
    padding-top: var(--gap-sm);
    padding-bottom: var(--gap-sm);
  }
}

// ── 左右側按鈕容器（固定寬，讓標題真正置中）──────────────────
.booking-header__side {
  flex-shrink: 0;
  width: $touch-target-size;             // 45px，與 main.scss .clickable-icon 一致
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

// ── 標題：使用 CSS 變數，符合手冊規範 ─────────────────────────
.booking-header__title {
  font-size: var(--app-font-size-base);  // 手機 16px / PC 18px 自動切換
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: var(--lh-relaxed, 1.5);
}

// ── 計時器 ─────────────────────────────────────────────────────
.booking-header__timer {
  font-size: var(--app-font-size-sm, #{$font-size-sm-mobile});
  font-weight: 600;
  color: $vieshow-danger;
  letter-spacing: 0.05em;

  &--urgent {
    animation: blink 1s step-start infinite;
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
</style>