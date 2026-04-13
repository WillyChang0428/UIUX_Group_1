<template>
  <div class="bottom-bar">
    <div class="container pb-4 pt-4 py-md-2">
      <div
        class="d-flex align-items-center justify-content-between bottom-bar__inner"
      >
        <div class="bottom-bar__price-block pe-3 pe-md-4">
          <div class="d-flex align-items-baseline gap-2 mb-1">
            <p class="mb-0 fw-bold text-white bottom-bar__total flex-shrink-0">
              NT$ {{ bookingStore.checkoutTotal.toLocaleString() }}
            </p>
            <p
              v-if="selectedItemNames"
              class="mb-0 text-secondary bottom-bar__items text-truncate me-auto"
            >
              {{ selectedItemNames }}
            </p>
          </div>

          <p
            v-if="bookingStore.handlingFee > 0"
            class="mb-0 bottom-bar__fee text-secondary"
          >
            含線上訂票手續費 NT$ {{ bookingStore.handlingFee.toLocaleString() }}
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

    <div
      v-if="isLoading"
      class="loading-overlay d-flex justify-content-center align-items-center"
    >
      <div class="spinner-border text-primary" role="status"></div>
    </div>
  </div>
  <LoginView v-model="showLoginModal" @success="handleLoginSuccess" />
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBookingStore } from "@/store/bookingStore";
import { useAuthStore } from "@/store/authStore";
import PrimaryButton from "@/components/Common/Button/PrimaryButton.vue";
import LoginView from "@/views/Auth/LoginView.vue";

const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();
const authStore = useAuthStore(); // 💡 實體化 authStore

const isLoading = ref(false);
const showLoginModal = ref(false);

// ── 💡 金額與明細計算 ──────────────────────────────────────────

// 3. 擷取並格式化選購項目名稱 (包含數量)
const selectedItemNames = computed(() => {
  const items = [];

  // 輔助函式：超過 5 個字就截斷並加上 ...
  const truncate = (name) =>
    name.length > 5 ? name.slice(0, 5) + "..." : name;

  // 抓取一般票
  if (bookingStore.tickets) {
    bookingStore.tickets.forEach((t) => {
      // 💡 修改這裡：補上數量顯示，例如 "全票 *2"
      if (t.quantity > 0) items.push(`${truncate(t.name)} *${t.quantity}`);
    });
  }

  // 抓取套票
  if (bookingStore.combos) {
    bookingStore.combos.forEach((c) => {
      // 💡 修改這裡：補上數量顯示
      if (c.quantity > 0) items.push(`${truncate(c.name)} *${c.quantity}`);
    });
  }

  // 抓取餐飲
  if (bookingStore.foodAddOns) {
    bookingStore.foodAddOns.forEach((f) => {
      // 💡 修改這裡：補上數量顯示
      if (f.quantity > 0) items.push(`${truncate(f.name)} *${f.quantity}`);
    });
  }

  // 將所有項目用「、」串接起來
  return items.join("、");
});

// ── 防呆機制：判斷按鈕是否應該被禁用 ─────────────────────────
const isNextButtonDisabled = computed(() => {
  const path = route.path.toLowerCase();

  if (isLoading.value) return true;

  // 💡 1. 補上「選擇座位頁」的防呆邏輯
  if (path.includes("seat")) {
    // 如果目前選取的座位數量，不等於總購買票數，就把按鈕鎖死！
    return bookingStore.selectedSeats.length !== bookingStore.totalTicketCount;
  }

  // 以下保留您原本寫好的付款頁防呆邏輯...
  if (path.includes("paying") || path.includes("payment")) {
    // ❌ 條件 1：如果完全沒有選付款方式，直接鎖死
    if (!bookingStore.paymentMethod) return true;

    // 💰 條件 2：如果是選擇「iShow儲值金」
    if (bookingStore.paymentMethod === "ishowCash") {
      const balance = authStore.currentUser?.walletBalance || 0;
      return balance < bookingStore.checkoutTotal; 
    }

    // 💳 條件 3：如果是選擇「信用卡」
    if (bookingStore.paymentMethod === "creditCard") {
      return !bookingStore.selectedCard;
    }

    // 🛡️ 終極防呆：如果有其他未知的付款狀態，一律鎖死
    return true;
  }

  return false;
});

// ── 動態判斷按鈕文字 ───────────────────────────────────────────
const nextButtonText = computed(() => {
  const path = route.path.toLowerCase();

  if (path.includes("ticket") || path.includes("fastbooking"))
    return "選擇座位";
  if (path.includes("seat")) return "加購餐點";
  if (path.includes("food") || path.includes("addon")) return "確認訂單";
  if (path.includes("paying") || path.includes("payment"))
    return isLoading.value ? "處理中..." : "確認付款";

  return "下一步";
});

// ── 點擊按鈕的跳轉與邏輯 ────────────────────────────────────────
const handleNextStep = () => {
  const path = route.path.toLowerCase();

  if (path.includes("ticket")) {
    router.push("/booking/seat");
  } else if (path.includes("seat")) {
    if (bookingStore.selectedSeats.length !== bookingStore.totalTicketCount) {
      alert(`請選滿 ${bookingStore.totalTicketCount} 個座位再繼續！`);
      return;
    }
    router.push("/booking/food");
  } else if (path.includes("food") || path.includes("addon")) {
    // 💡 3. 攔截點：檢查是否有登入 (依據您的 store 變數，可能是 currentUser 或 isLoggedIn)
    if (!authStore.currentUser) {
      showLoginModal.value = true; // 沒登入，打開彈窗
      return; // 終止跳轉
    }
    // 有登入，直接去付款頁
    router.push("/booking/paying");
  } else if (path.includes("paying") || path.includes("payment")) {
    processPayment();
  }
};

// 💡 4. 登入成功後的處理動作
const handleLoginSuccess = () => {
  showLoginModal.value = false; // 關閉彈窗
  router.push("/booking/paying"); // 自動幫使用者前往付款頁
};

// ── 處理付款流程 ───────────────────────────────────────────
const processPayment = () => {
  isLoading.value = true;

  // 💡 扣除儲值金邏輯：只有在選擇「儲值金付款」且「有登入會員」時才扣錢
  if (bookingStore.paymentMethod === "ishowCash" && authStore.currentUser) {
    authStore.currentUser.walletBalance -= bookingStore.checkoutTotal;
    // (如果實戰中有後端 API，這裡就會是發送扣款 Request 的地方)
  }

  // 模擬 API 處理時間
  setTimeout(() => {
    isLoading.value = false;
    router.push("/final"); // 導向結帳完成頁
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
  z-index: 1050;
  background: $vieshow-dark;
  border-top: 1px solid rgba($white, 0.1);
  box-shadow: 0 -4px 24px rgba($black, 0.4);
}

.bottom-bar__inner {
  min-height: 48px;
}

/* 確保左側區塊在過長時能正確啟用截斷效果 */
.bottom-bar__price-block {
  flex: 1;
  min-width: 0;
}

/* 💡 新增：選購項目名稱樣式 */
.bottom-bar__items {
  font-size: var(--app-font-size-sm);
  letter-spacing: 0.05em;
  /* Bootstrap text-truncate 會處理單行省略，但我們加個安全距離 */
  max-width: 100%;
}

.bottom-bar__total {
  font-size: var(--app-font-size-h5);
  line-height: 1.2;
}

/* 💡 新增：手續費小字樣式 */
.bottom-bar__fee {
  font-size: var(--app-font-size-mini);
  letter-spacing: 0.05em;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 2000;
}
</style>
