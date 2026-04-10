<template>
  <div class="bottom-bar">
    <div class="container pb-5 pt-4 py-md-2">
      <div class="d-flex align-items-center justify-content-between bottom-bar__inner">

        <div class="bottom-bar__price-block pe-3 pe-md-4">
          <p class="mb-0 fw-bold text-white bottom-bar__total">
            NT$ {{ displayTotal.toLocaleString() }}
          </p>
        </div>

        <div class="flex-shrink-0 bottom-bar__btn-wrap">

          <PrimaryButton
            v-if="bookingStore.totalTicketCount === 0"
            status="unable"
            is-disabled
          >
            選擇座位
          </PrimaryButton>

          <PrimaryButton
            v-else
            @click="handleNextStep"
            :is-disabled="isNextButtonDisabled"
          >
            {{ nextButtonText }}
          </PrimaryButton>

        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-overlay d-flex justify-content-center align-items-center">
      <div class="spinner-border text-primary" role="status"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBookingStore } from '@/store/bookingStore';
import PrimaryButton from '@/components/Common/Button/PrimaryButton.vue';

const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();

const isLoading = ref(false);

// ── 總金額計算 (包含手續費) ──────────────────────────────────
const displayTotal = computed(() => {
  const handlingFee = bookingStore.totalTicketCount * 20;
  return bookingStore.finalTotal + handlingFee;
});

// ── 💡 防呆機制：判斷按鈕是否應該被禁用 ─────────────────────────
const isNextButtonDisabled = computed(() => {
  const path = route.path.toLowerCase();
  
  // 1. 如果正在 API 處理中 (Loading)，絕對禁用防止重複點擊
  if (isLoading.value) return true;
  
  // 2. 如果人在付款頁，且尚未選擇付款方式，則禁用
  if (path.includes('paying') || path.includes('payment')) {
    return bookingStore.paymentMethod === null;
  }
  
  // 其他頁面預設不額外禁用
  return false;
});

// ── 動態判斷按鈕文字 ───────────────────────────────────────────
const nextButtonText = computed(() => {
  const path = route.path.toLowerCase();
  
  if (path.includes('ticket') || path.includes('fastbooking')) return '選擇座位';
  if (path.includes('seat')) return '加購餐點';
  if (path.includes('food') || path.includes('addon')) return '確認訂單';
  if (path.includes('paying') || path.includes('payment')) return isLoading.value ? '處理中...' : '確認付款';
  
  return '下一步'; 
});

// ── 點擊按鈕的跳轉與邏輯 (完全保留您的設定) ────────────────────────
const handleNextStep = () => {
  const path = route.path.toLowerCase();

  if (path.includes('ticket')) {
    router.push('/booking/seat'); 
  } 
  else if (path.includes('seat')) {
    if (bookingStore.selectedSeats.length !== bookingStore.totalTicketCount) {
      alert(`請選滿 ${bookingStore.totalTicketCount} 個座位再繼續！`);
      return;
    }
    router.push('/booking/food'); 
  } 
  else if (path.includes('food') || path.includes('addon')) {
    router.push('/booking/paying'); 
  }
  // 💡 4. 如果在【付款頁】，執行原本寫在 Paying.vue 的付款打 API 流程
  else if (path.includes('paying') || path.includes('payment')) {
    processPayment();
  }
};

// ── 處理付款流程 ───────────────────────────────────────────
const processPayment = () => {
  isLoading.value = true;
  
  // 模擬金流 API 處理時間 (1.5 秒)
  setTimeout(() => {
    isLoading.value = false;
    router.push('/final'); 
  }, 1500);
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  background: $vieshow-dark;
  border-top: 1px solid rgba($white, 0.1);
  box-shadow: 0 -4px 24px rgba($black, 0.4);
}

.bottom-bar__inner {
  min-height: 48px;
}

.bottom-bar__price-block {
  flex: 1;
  min-width: 0;
}

.bottom-bar__total {
  font-size: var(--app-font-size-h5); 
  line-height: 1.2;
}

.loading-overlay {
  position: fixed; 
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 2000; 
}
</style>