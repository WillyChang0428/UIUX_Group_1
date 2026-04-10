<template>
  <header class="booking-header">
    <div class="container-md p-0">
      <ul class="d-flex justify-content-between align-items-center booking-header__bar container-md">

        <li class="booking-header__side">
          <button v-if="step !== 5" class="clickable-icon" @click="handleBack">
            <i class="fa-solid fa-angle-left text-secondary"></i>
          </button>
        </li>

        <li class="d-flex justify-content-center align-items-center flex-grow-1 position-relative">
          <p class="mb-0 text-white lh-relaxed booking-header__title">{{ currentTitle }}</p>
          <div v-if="step !== 5" class="position-absolute end-0 small booking-header__timer"
            :class="{ 'text-danger': isUrgent, 'booking-header__timer--urgent': isUrgent }">
            {{ formattedTime }}
          </div>
        </li>

        <li class="booking-header__side">
          <button class="clickable-icon" @click="handleClose">
            <i class="fa-solid fa-xmark text-secondary"></i>
          </button>
        </li>

      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBookingStore } from '@/store/bookingStore'; // 💡 引入您的訂票 Store

const props = defineProps({
  // 目前步驟：1=選擇票種 2=選擇座位 3=加購餐點 4=發票選擇 5=訂單完成
  step: {
    type: Number,
    default: 1,
    validator: (v) => [1, 2, 3, 4, 5].includes(v),
  },
  totalSeconds: { type: Number, default: 600 },
});

const router = useRouter();
const bookingStore = useBookingStore();

// ── 💡 導覽與狀態控制邏輯 ───────────────────────────────────────

// 點擊左側箭頭：返回瀏覽器的上一頁
const handleBack = () => {
  router.back();
};

// 點擊右側叉叉：清空購物車資料，並跳轉回首頁
const handleClose = () => {
  bookingStore.resetBooking(); // 呼叫您在 Store 中寫好的清空方法
  router.push('/');            // 回到首頁
};

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
      // 若倒數結束，也可以在這裡觸發 handleClose() 強制回首頁
      return;
    }
    secondsLeft.value--;
  }, 1000);
});

onUnmounted(() => { clearInterval(timer); });
</script>

<style lang="scss" scoped>
/* 💡 拔除下方所有 v. 前綴，確保變數正確編譯 */
@import "@/assets/scss/variables";

.booking-header {
  position: fixed;
  left: 0;
  right: 0;
  height: fit-content;
  display: flex;
  align-items: center;
  z-index: 1030; 
  background-color: $vieshow-dark; // 💡 修正
  border-bottom: 1px solid rgba($white, 0.05);

  @include media-breakpoint-up(md) { // 💡 修正
    top: $web-top-padding-pc; // 💡 修正
  }
}

.booking-header__bar {
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 48px 0 var(--gap-lg);
  
  @include media-breakpoint-up(md) { // 💡 修正
    padding: 16px var(--gap-lg);
  }
}

.booking-header__side {
  flex-shrink: 0;
  width: $touch-target-size; 
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.booking-header__title {
  font-size: var(--app-font-size-base);
  font-weight: $font-weight-bold;
  letter-spacing: $letter-spacing-wide;
}

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