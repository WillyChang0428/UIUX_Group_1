<template>
  <div
    class="ishow-cash-container"
    :class="{
      'is-active':
        isSelected && isBalanceSufficient /* 💡 充足且選取時，藍框 */,
      'is-insufficient':
        isSelected && !isBalanceSufficient /* 💡 不足且選取時，紅框 */,
    }"
  >
    <div class="header-row" @click="toggleSelection">
      <div class="d-flex align-items-center gap-3">
        <div class="wallet-icon-box">
          <i class="fa-solid fa-wallet fs-4 text-secondary"></i>
        </div>

        <div class="d-flex flex-column">
          <div class="d-flex align-items-center gap-2">
            <span class="fs-5 fw-bold text-white">iShow儲值金</span>
            <span
              v-if="!isBalanceSufficient"
              class="badge bg-danger rounded-pill px-2 py-1"
            >
              餘額不足
            </span>
          </div>
          <span class="text-secondary fs-6"
            >餘額NT {{ currentBalance.toLocaleString() }}元</span
          >
        </div>
      </div>

      <div class="radio-circle">
        <div class="radio-inner"></div>
      </div>
    </div>

    <div
      v-if="isSelected && !isBalanceSufficient"
      class="top-up-section mt-3 pt-3"
    >
      <p class="text-secondary fs-6 mb-3">
        儲值金餘額不足，請在下方選擇加值金額。
      </p>

      <div class="d-flex flex-wrap gap-2 mb-4">
        <button
          v-for="amount in [1000, 2000]"
          :key="amount"
          class="amount-btn"
          :class="{ 'is-active': activeTab === amount }"
          @click="selectTab(amount)"
        >
          NT {{ amount.toLocaleString() }}
        </button>

        <button
          class="amount-btn"
          :class="{ 'is-active': activeTab === 'custom' }"
          @click="selectTab('custom')"
        >
          {{
            activeTab === "custom" && confirmedCustomValue
              ? `NT ${confirmedCustomValue.toLocaleString()}`
              : "自訂金額"
          }}
        </button>
      </div>

      <div
        v-if="activeTab === 'custom' && !confirmedCustomValue"
        class="d-flex gap-2 mb-4"
      >
        <input
          type="number"
          v-model.number="customInputValue"
          class="form-control-dark flex-grow-1"
          placeholder="請輸入儲值金額 (最低 1,000)"
        />

        <PrimaryButton
          v-if="customInputValue >= 1000"
          @click="confirmCustomAmount"
        >
          完成
        </PrimaryButton>
        <PrimaryButton v-else status="unable" is-disabled> 完成 </PrimaryButton>
      </div>

      <div
        v-if="activeTab !== 'custom' || confirmedCustomValue"
        class="credit-card-form"
      >
        <p class="text-white fs-6 mb-2">信用卡付款</p>

        <div class="input-group-custom mb-3 position-relative">
          <input
            type="text"
            v-model="cardNumber"
            class="form-control-dark w-100"
            placeholder="卡號 (1234-5678-****-5678)"
            v-maska="'####-####-####-####'"
          />
          <i
            v-if="cardBrandIcon"
            :class="['fa-brands', cardBrandIcon, 'card-brand-icon fs-5']"
          ></i>
        </div>

        <div class="d-flex gap-3 mb-4">
          <div class="input-group-custom flex-grow-1">
            <input
              type="text"
              v-model="cvv"
              class="form-control-dark w-100"
              placeholder="檢查碼 (3碼)"
              maxlength="3"
            />
          </div>
          <div class="input-group-custom flex-grow-1">
            <input
              type="text"
              v-model="expiry"
              class="form-control-dark w-100"
              placeholder="有效期限 (MM/YY)"
              v-maska="'##/##'"
            />
          </div>
        </div>

        <div class="d-flex justify-content-end">
          <PrimaryButton v-if="isFormValid" @click="handleTopUp">
            完成
          </PrimaryButton>
          <PrimaryButton v-else status="unable" is-disabled>
            完成
          </PrimaryButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue"; // 💡 1. 記得引入 watch
import { vMaska } from "maska/vue";
import { useAuthStore } from "@/store/authStore";
import PrimaryButton from "@/components/Common/Button/PrimaryButton.vue";

// 💡 1. 在 props 中新增 currentMethod
const props = defineProps({
  checkoutTotal: { type: Number, required: true, default: 0 },
  currentMethod: { type: String, default: "" },
});
const emit = defineEmits(["select", "topup-success"]);

const authStore = useAuthStore();
// 💡 2. 刪除原本的 ref(false)，改用 computed 判斷自己是否被選中
const isSelected = computed(() => props.currentMethod === "ishowCash");

const currentBalance = computed(
  () => authStore.currentUser?.walletBalance || 0,
);

const isBalanceSufficient = computed(() => {
  return currentBalance.value >= props.checkoutTotal;
});

// 💡 3. 修改點擊邏輯：如果還沒被選中，才發送選取訊號 (防止雙擊取消)
const toggleSelection = () => {
  if (!isSelected.value) {
    emit("select", "ishowCash");
  }
};

// ── 儲值選項與自訂金額邏輯 ──────────────────────────────────
const activeTab = ref(1000);
const customInputValue = ref("");
const confirmedCustomValue = ref(null);

const selectTab = (tab) => {
  activeTab.value = tab;
  if (tab !== "custom") {
    confirmedCustomValue.value = null;
    customInputValue.value = "";
  } else {
    confirmedCustomValue.value = null;
  }
  cardNumber.value = "";
  cvv.value = "";
  expiry.value = "";
};

const confirmCustomAmount = () => {
  if (customInputValue.value >= 1000) {
    confirmedCustomValue.value = customInputValue.value;
  }
};

// ── 信用卡表單邏輯 ────────────────────────────────────────
const cardNumber = ref("");
const cvv = ref("");
const expiry = ref("");
const cardBrandIcon = ref("");

// 💡 2. 使用 watch 監聽 cardNumber，不受套件干擾，即時判斷信用卡品牌
watch(cardNumber, (newVal) => {
  const val = newVal.replace(/-/g, ""); // 移除橫線後判斷
  if (val.startsWith("4")) cardBrandIcon.value = "fa-cc-visa";
  else if (/^5[1-5]/.test(val)) cardBrandIcon.value = "fa-cc-mastercard";
  else if (/^3[47]/.test(val)) cardBrandIcon.value = "fa-cc-amex";
  else if (/^352[89]|^35[3-8][0-9]/.test(val))
    cardBrandIcon.value = "fa-cc-jcb";
  else cardBrandIcon.value = "";
});

const isFormValid = computed(() => {
  const isCardValid = cardNumber.value.length === 19;
  const isCvvValid = cvv.value.length === 3;
  const isExpiryValid = expiry.value.length === 5;
  return isCardValid && isCvvValid && isExpiryValid;
});

const handleTopUp = () => {
  if (!isFormValid.value) return;

  const rawValue =
    activeTab.value === "custom" ? confirmedCustomValue.value : activeTab.value;

  // 💡 3. 強制轉為 Number，確保數學加法正確執行 (避免字串相加)
  const topUpValue = Number(rawValue);

  if (typeof authStore.addBalance === "function") {
    // 如果您的 Store 裡面有寫好 addBalance 這個 action，優先呼叫它
    authStore.addBalance(topUpValue);
  } else {
    // ⚠️ 如果目前是未登入狀態 (currentUser 為 null)，為了測試順利，我們幫他建立一個假的會員實體
    if (!authStore.currentUser) {
      authStore.currentUser = { walletBalance: 0 };
    }
    // 將金額加上去
    authStore.currentUser.walletBalance =
      Number(authStore.currentUser.walletBalance) + topUpValue;
  }

  // 清空表單與重置狀態
  cardNumber.value = "";
  cvv.value = "";
  expiry.value = "";
  selectTab(1000);
  emit("topup-success", topUpValue);
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.ishow-cash-container {
  border: 1px solid rgba($white, 0.2);
  border-radius: var(--app-radius-lg);
  background-color: transparent;
  padding: var(--gap-md);
  transition: all 0.3s ease;
  overflow: hidden;

  /* 💡 充足且選取時顯示藍色 */
  &.is-active {
    border-color: $vieshow-primary;

    // 👇 新增這段：背景變品牌藍、icon 變白
    .wallet-icon-box {
      background-color: $vieshow-primary;
      i {
        color: $white !important;
      }
    }

    .radio-circle {
      border-color: $vieshow-primary;
      .radio-inner {
        transform: scale(1);
        opacity: 1;
      }
    }
  }

  /* 💡 不足且選取時顯示紅色 */
  &.is-insufficient {
    border-color: $vieshow-danger;
    .radio-circle {
      border-color: rgba($white, 0.3); // 不足時外圈維持灰色，等待儲值
      .radio-inner {
        transform: scale(0);
        opacity: 0;
      }
    }
  }
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.wallet-icon-box {
  width: var(--gap-xl);
  height: var(--gap-xl);
  border-radius: var(--app-radius);
  background-color: rgba($white, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba($white, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  .radio-inner {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: $white;
    transform: scale(0);
    opacity: 0;
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
}

.top-up-section {
  border-top: 1px solid rgba($white, 0.1);
}

.amount-btn {
  background: transparent;
  border: 1px solid rgba($white, 0.2);
  border-radius: var(--app-radius-sm);
  color: $white;
  padding: var(--gap-sm) var(--gap-md);
  font-size: var(--app-font-size-base);
  cursor: pointer;
  transition: all 0.2s ease;

  @include hover-focus {
    background: rgba($white, 0.05);
  }

  &.is-active {
    background-color: rgba($vieshow-danger, 0.2);
    border-color: $vieshow-danger;
    color: $white;
  }
}

.form-control-dark {
  background-color: transparent;
  border: 1px solid rgba($white, 0.3);
  border-radius: var(--app-radius);
  color: $white;
  padding: var(--gap-sm) var(--gap-md);
  font-size: var(--app-font-size-base);
  transition: border-color 0.2s ease;

  &::placeholder {
    color: rgba($white, 0.3);
  }

  &:focus {
    outline: none;
    border-color: $white;
  }
}

.card-brand-icon {
  position: absolute;
  right: var(--gap-md);
  top: 50%;
  transform: translateY(-50%);
  color: $white;
}

.fa-cc-visa {
  color: #1a1f71;
  background: white;
  border-radius: 2px;
}
.fa-cc-mastercard {
  color: #ff5f00;
}
.fa-cc-jcb {
  color: #007940;
  background: white;
  border-radius: 2px;
}
.fa-cc-amex {
  color: #002663;
  background: white;
  border-radius: 2px;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>
