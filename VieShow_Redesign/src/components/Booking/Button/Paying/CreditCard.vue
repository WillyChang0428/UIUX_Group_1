<template>
  <div class="credit-card-container" :class="{ 'is-active': isSelected }">
    <div class="header-row" @click="toggleSelection">
      <div class="d-flex align-items-center gap-3">
        <div class="wallet-icon-box">
          <i class="fa-regular fa-credit-card fs-4 text-secondary"></i>
        </div>

        <div class="d-flex flex-column">
          <span class="fs-5 fw-bold text-white">信用卡付款</span>
          <span class="text-secondary fs-6">支援各大銀行信用卡</span>
        </div>
      </div>

      <div class="radio-circle">
        <div class="radio-inner"></div>
      </div>
    </div>

    <div v-if="isSelected" class="body-section mt-3 pt-3">
      <div v-if="savedCards.length > 0" class="saved-cards-list mb-3">
        <div
          v-for="card in savedCards"
          :key="card.id"
          class="saved-card-item d-flex align-items-center justify-content-between cursor-pointer"
          :class="{ 'is-selected': selectedCardId === card.id }"
          @click="selectSavedCard(card.id)"
        >
          <div class="d-flex align-items-center gap-3">
            <span class="brand-badge" :class="card.brand.toLowerCase()">
              {{ card.brand }}
            </span>
            <span class="text-white fs-6"
              >{{ card.bankName }} / ****{{ card.last4 }}</span
            >
          </div>
          <i
            v-if="selectedCardId === card.id"
            class="fa-solid fa-circle-check text-primary fs-5"
          ></i>
        </div>
      </div>

      <div
        class="add-card-toggle d-flex align-items-center gap-2 mb-3 cursor-pointer"
        @click="toggleAddCardForm"
      >
        <i
          class="fa-solid fs-4 text-secondary"
          :class="isAddingCard ? 'fa-circle-minus' : 'fa-circle-plus'"
        ></i>
        <span class="text-secondary fs-6">增加信用卡</span>
      </div>

      <div v-if="isAddingCard" class="credit-card-form">
        <div class="input-group-custom mb-3 position-relative">
          <input
            type="text"
            v-model="cardNumber"
            class="form-control-dark w-100"
            placeholder="卡號 (1234-5678-****-5678)"
            v-maska="'####-####-####-####'"
            @input="handleCardInput"
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
          <PrimaryButton v-if="isFormValid" @click="handleSaveCard">
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
import { ref, computed, watch } from "vue";
import { vMaska } from "maska/vue";
import { useBookingStore } from "@/store/bookingStore";
import PrimaryButton from "@/components/Common/Button/PrimaryButton.vue"; // 💡 確保路徑與您的專案一致
const bookingStore = useBookingStore();

// 💡 2. 宣告接收父層傳來的 currentMethod
const props = defineProps({
  currentMethod: { type: String, default: "" },
});

const emit = defineEmits(["select", "card-saved"]);

// ── 狀態控制 ─────────────────────────────────────────
// 💡 3. 改用 computed 判斷是否被選中
const isSelected = computed(() => props.currentMethod === "creditCard");
const isAddingCard = ref(false); // 控制 + / - 展開表單

// 💡 4. 修改點擊邏輯：只能選取，不能取消
const toggleSelection = () => {
  if (!isSelected.value) {
    emit("select", "creditCard");
  }
};

// 💡 5. 當使用者點擊「iShow儲值金」，導致信用卡被取消選取時，自動收起表單
watch(isSelected, (newVal) => {
  if (!newVal) {
    isAddingCard.value = false;
  }
});

const toggleAddCardForm = () => {
  isAddingCard.value = !isAddingCard.value;
};

// ── 儲存的信用卡清單邏輯 ─────────────────────────────────
const savedCards = ref([]); // 模擬已綁定的信用卡
const selectedCardId = ref(null); // 目前選用哪張卡

const selectSavedCard = (id) => {
  selectedCardId.value = id;
  isAddingCard.value = false;

  // 🔽 新增這行：把選中的卡片存進大腦
  bookingStore.updateSelectedCard(savedCards.value.find((c) => c.id === id));
};

// ── 信用卡表單邏輯 ────────────────────────────────────────
const cardNumber = ref("");
const cvv = ref("");
const expiry = ref("");
const cardBrandIcon = ref("");
const cardBrandName = ref(""); // 存給 Badge 用的純文字 (如 VISA)

const handleCardInput = (e) => {
  const val = e.target.value.replace(/-/g, "");
  if (val.startsWith("4")) {
    cardBrandIcon.value = "fa-cc-visa";
    cardBrandName.value = "VISA";
  } else if (/^5[1-5]/.test(val)) {
    cardBrandIcon.value = "fa-cc-mastercard";
    cardBrandName.value = "MASTER";
  } else if (/^3[47]/.test(val)) {
    cardBrandIcon.value = "fa-cc-amex";
    cardBrandName.value = "AMEX";
  } else if (/^352[89]|^35[3-8][0-9]/.test(val)) {
    cardBrandIcon.value = "fa-cc-jcb";
    cardBrandName.value = "JCB";
  } else {
    cardBrandIcon.value = "";
    cardBrandName.value = "CARD";
  }
};

// 驗證表單 (都填對了按鈕才會亮)
const isFormValid = computed(() => {
  const isCardValid = cardNumber.value.length === 19; // 16數字 + 3橫線
  const isCvvValid = cvv.value.length === 3;
  const isExpiryValid = expiry.value.length === 5; // MM/YY
  return isCardValid && isCvvValid && isExpiryValid;
});

// 儲存信用卡並收起表單
// 💡 3. 找到 handleSaveCard 函式，在把新卡 push 之後，補上存入大腦的代碼：
const handleSaveCard = () => {
  if (!isFormValid.value) return;
  const last4 = cardNumber.value.slice(-4);
  const newCard = {
    id: Date.now(),
    brand: cardBrandName.value,
    bankName: "國泰銀-cube卡",
    last4: last4,
  };
  savedCards.value.push(newCard);
  selectedCardId.value = newCard.id;

  // 🔽 新增這行：把剛綁好的新卡直接存進大腦
  bookingStore.updateSelectedCard(newCard);

  cardNumber.value = "";
  cvv.value = "";
  expiry.value = "";
  isAddingCard.value = false;
  emit("card-saved", newCard);
};
</script>

<style lang="scss" scoped>
/* 💡 統一使用 @import 並且拔除 v. 前綴 */
@import "@/assets/scss/variables";

.credit-card-container {
  border: 1px solid rgba($white, 0.2);
  border-radius: var(--app-radius-lg);
  background-color: transparent;
  padding: var(--gap-md);
  transition: all 0.3s ease;
  overflow: hidden;

  /* 💡 選取狀態 (藍框) */
  &.is-active {
    border-color: $vieshow-primary;

    .wallet-icon-box {
      background-color: $vieshow-primary;
      i {
        color: $white !important; // 覆蓋原本的 text-secondary
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

.body-section {
  border-top: 1px solid rgba($white, 0.1);
}

.cursor-pointer {
  cursor: pointer;
}

/* --- 新增信用卡展開按鈕 (+ / -) --- */
.add-card-toggle {
  padding: var(--gap-xs) 0;
  transition: opacity 0.2s ease;

  @include hover-focus {
    opacity: 0.7;
  }

  i {
    transition: transform 0.3s ease;
  }
}

/* --- 已儲存的信用卡清單項目 --- */
.saved-card-item {
  padding: var(--gap-sm) 0;
  border-radius: var(--app-radius-sm);
  transition: background-color 0.2s ease;

  @include hover-focus {
    background-color: rgba($white, 0.05);
  }
}

/* 小品牌的 Badge 樣式 (模仿截圖中的藍色 VISA 小框) */
.brand-badge {
  display: inline-block;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 4px;
  background-color: $vieshow-primary; // 預設藍色
  color: $white;
  letter-spacing: 1px;

  &.master {
    background-color: #ff5f00;
  }

  &.jcb {
    background-color: #007940;
  }

  &.amex {
    background-color: #002663;
  }
}

/* --- 信用卡表單樣式 --- */
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
</style>
