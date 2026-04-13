<template>
  <header class="booking-header">
    <div class="container">
      <ul
        class="d-flex justify-content-between align-items-center booking-header__bar"
      >
        <li class="booking-header__side">
          <button v-if="step !== 5" class="clickable-icon" @click="handleBack">
            <i class="fa-solid fa-angle-left text-secondary fs-6"></i>
          </button>
        </li>

        <li
          class="d-flex justify-content-center align-items-center flex-grow-1 position-relative"
        >
          <p class="mb-0 text-white lh-relaxed booking-header__title">
            {{ currentTitle }}
          </p>
          <div
            v-if="step !== 5"
            class="position-absolute end-0 small booking-header__timer"
            :class="{
              'text-danger': isUrgent,
              'booking-header__timer--urgent': isUrgent,
            }"
          >
            {{ formattedTime }}
          </div>
        </li>

        <li class="booking-header__side">
          <button class="clickable-icon" @click="handleClose">
            <i class="fa-solid fa-xmark text-secondary fs-6"></i>
          </button>
        </li>
      </ul>
    </div>
  </header>
  <BaseModal v-model="isDeleteOpen" type="danger">
    <template #title>訂票逾時</template>
    <template #content>訂票時間到，即將為您跳轉，請重新訂票。</template>
  </BaseModal>
</template>

<script setup>
// 💡 確保有引入 watch
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useBookingStore } from "@/store/bookingStore";
import BaseModal from "../../Common/Button/BaseModal.vue";

const props = defineProps({
  step: {
    type: Number,
    default: 1,
    validator: (v) => [1, 2, 3, 4, 5].includes(v),
  },
  totalSeconds: { type: Number, default: 600 },
});

const router = useRouter();
const bookingStore = useBookingStore();

// ── 變數宣告 ──
const isDeleteOpen = ref(false);
const secondsLeft = ref(props.totalSeconds);
let timer = null;
let timeoutId = null;

// ── 清除計時器的共用函式 (確保任何情況下都能乾淨殺死計時器) ──
const clearAllTimers = () => {
  if (timer) clearInterval(timer);
  if (timeoutId) clearTimeout(timeoutId);
};

// ── 導覽與狀態控制邏輯 ──
const handleBack = () => {
  router.back();
};

const handleClose = () => {
  clearAllTimers(); // 💡 修正 1：關閉前確實殺死背景計時器
  bookingStore.resetBooking();
  router.push("/");
};

// ── 步驟標題 ──
const stepTitles = {
  1: "選擇票種",
  2: "選擇座位",
  3: "加購餐點",
  4: "發票選擇",
  5: "訂單完成",
};
const currentTitle = computed(() => stepTitles[props.step] ?? "購票流程");

// ── 倒數計時邏輯 ──
const formattedTime = computed(() => {
  const m = Math.floor(secondsLeft.value / 60)
    .toString()
    .padStart(2, "0");
  const s = (secondsLeft.value % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
});
const isUrgent = computed(() => secondsLeft.value <= 60);

const startTimer = () => {
  // 如果已經是第五步，或是計時器已經在跑了，就不啟動
  if (props.step === 5 || timer) return;

  timer = setInterval(() => {
    if (secondsLeft.value <= 0) {
      clearAllTimers(); // 💡 修正 2：使用共用清理函式

      isDeleteOpen.value = true;

      timeoutId = setTimeout(() => {
        isDeleteOpen.value = false;
        bookingStore.resetBooking();
        router.push("/");
      }, 3000);
      return;
    }
    secondsLeft.value--;
  }, 1000);
};

// 💡 修正 3：利用 watch 監聽步驟變化。
// 當走到第 5 步 (結帳完成) 時，立刻停止計時器，避免把使用者踢出去！
watch(
  () => props.step,
  (newStep) => {
    if (newStep === 5) {
      clearAllTimers();
    }
  },
);

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  clearAllTimers();
});
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
  z-index: 1050;
  background-color: $vieshow-dark;
  border-bottom: 1px solid rgba($white, 0.05);

  @include media-breakpoint-up(md) {
    top: $web-top-padding-pc;
  }
}

.booking-header__bar {
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  height: v.$web-top-padding-mobile;

  @include media-breakpoint-up(md) {
    // 💡 修正
    padding: 8px 0;
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
