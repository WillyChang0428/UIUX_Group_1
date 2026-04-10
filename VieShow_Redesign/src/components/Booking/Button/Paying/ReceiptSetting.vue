<template>
    <div class="receipt-setting-container">
        <div class="receipt-grid mb-4">
            <button v-for="option in receiptOptions" :key="option.id" class="receipt-btn"
                :class="{ 'is-active': selectedType === option.id }" @click="selectReceiptType(option.id)">
                {{ option.label }}
            </button>
        </div>

        <div class="receipt-content">

            <div v-if="selectedType === 'personal-e'" class="content-block fade-in">
                <p class="text-secondary hint-text">
                    威秀影城全面採電子發票，不主動寄出，發票號碼將上傳至政府平台。
                </p>
            </div>

            <div v-if="selectedType === 'mobile-barcode'" class="content-block fade-in">
                <input type="text" v-model="barcodeInput" class="form-control-dark w-100 mb-3"
                    placeholder="輸入載具號碼 (例如:/ABC123A)" @input="emitData">

                <div class="d-flex justify-content-end">
                    <PrimaryButton v-if="isBarcodeValid" @click="handleSave">
                        儲存
                    </PrimaryButton>
                    <PrimaryButton v-else status="unable" is-disabled>
                        儲存
                    </PrimaryButton>
                </div>
            </div>

            <div v-if="selectedType === 'company-e'" class="content-block fade-in">
                <input type="text" v-model="taxIdInput" class="form-control-dark w-100 mb-3" placeholder="輸入統一編號"
                    maxlength="8" @input="emitData">
                <p class="text-secondary hint-text mb-3">
                    威秀影城全面採電子發票，不主動寄出，發票號碼將上傳至政府平台；開立後，請至訂單下載及列印，即可作為會計憑證報帳核銷。
                </p>

                <div class="d-flex justify-content-end">
                    <PrimaryButton v-if="isTaxIdValid" @click="handleSave">
                        儲存
                    </PrimaryButton>
                    <PrimaryButton v-else status="unable" is-disabled>
                        儲存
                    </PrimaryButton>
                </div>
            </div>

            <div v-if="selectedType === 'donate'" class="content-block fade-in">
                <ul class="donate-list mb-3">
                    <li v-for="charity in charityOptions" :key="charity.id" class="donate-item cursor-pointer"
                        :class="{ 'is-selected': selectedCharity === charity.id }" @click="selectCharity(charity.id)">
                        <div class="custom-radio">
                            <div class="radio-inner"></div>
                        </div>
                        <span class="text-white">{{ charity.name }}</span>
                    </li>
                </ul>

                <div class="d-flex justify-content-end">
                    <PrimaryButton v-if="isCharityValid" @click="handleSave">
                        儲存
                    </PrimaryButton>
                    <PrimaryButton v-else status="unable" is-disabled>
                        儲存
                    </PrimaryButton>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBookingStore } from '@/store/bookingStore';
import PrimaryButton from '@/components/Common/Button/PrimaryButton.vue'; 

const router = useRouter();
const bookingStore = useBookingStore();

// ── 定義可選的發票類型與捐贈單位 ───────────────────────────
const receiptOptions = [
    { id: 'personal-e', label: '個人 - 電子發票' },
    { id: 'mobile-barcode', label: '個人 - 手機條碼載具' },
    { id: 'company-e', label: '公司 - 電子發票' },
    { id: 'donate', label: '捐贈發票' }
];

const charityOptions = [
    { id: 'c1', name: '台灣之心愛護動物協會' },
    { id: 'c2', name: '台灣流浪貓狗關懷協會' },
    { id: 'c3', name: '台灣世界展望會' },
    { id: 'c4', name: '罕見疾病基金會' },
    { id: 'c5', name: '勵馨基金會' },
    { id: 'c6', name: '紅鼻子關懷小丑協會' }
];

// ── 初始化狀態變數 ───────────────────────────────────────
// 💡 重點：從 Store 中把舊的資料抓回來當作預設值！
// 這樣使用者如果填完又點進來修改，才看得到自己剛剛填的東西
const selectedType = ref(bookingStore.receipt.type);
const barcodeInput = ref(bookingStore.receipt.barcode);
const taxIdInput = ref(bookingStore.receipt.taxId);
const selectedCharity = ref(bookingStore.receipt.charityId);

// ── 表單驗證邏輯 (保留不變) ──────────────────────────────
const isBarcodeValid = computed(() => {
    const regex = /^\/[0-9A-Za-z\+\-\.]{7}$/;
    return regex.test(barcodeInput.value);
});

const isTaxIdValid = computed(() => {
    const regex = /^\d{8}$/;
    return regex.test(taxIdInput.value);
});

const isCharityValid = computed(() => {
    return selectedCharity.value !== '';
});

// ── 點擊切換邏輯 (移除了 emitData) ────────────────────────
const selectReceiptType = (id) => {
    selectedType.value = id;
    if (id !== 'mobile-barcode') barcodeInput.value = '';
    if (id !== 'company-e') taxIdInput.value = '';
    if (id !== 'donate') selectedCharity.value = '';
};

const selectCharity = (id) => {
    selectedCharity.value = id;
};

// ── 點擊「儲存」按鈕的行為 ─────────────────────────────
const handleSave = () => {
    // 1. 將資料寫入 Pinia Store
    bookingStore.updateReceipt({
        type: selectedType.value,
        barcode: barcodeInput.value.toUpperCase(),
        taxId: taxIdInput.value,
        charityId: selectedCharity.value
    });
    
    // 2. 回到上一頁 (即結帳頁)
    router.back();
};
</script>

<style lang="scss" scoped>
/* 💡 引入變數地基 */
@import "@/assets/scss/variables";

.receipt-setting-container {
    width: 100%;
}

/* --- 發票按鈕 2x2 Grid 排版 --- */
.receipt-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); // 雙欄等寬
    gap: var(--gap-md); // 16px / 32px
}

.receipt-btn {
    background: transparent;
    border: 1px solid rgba($white, 0.3);
    border-radius: var(--app-radius); // 對齊輸入框圓角
    color: $white;
    padding: var(--gap-md) var(--gap-lg);
    font-size: var(--app-font-size-base);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;

    // 避免文字在手機版過長導致破版
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @include media-breakpoint-up(md) {
        padding: var(--gap-sm) var(--gap-md);
        border-radius: var(--app-radius-sm);
    }

    @include hover-focus {
        background: rgba($white, 0.05);
    }

    /* 💡 選中狀態：暗紅底 + 亮紅框 */
    &.is-active {
        background-color: rgba($vieshow-danger, 0.15);
        border-color: $vieshow-danger;
        color: $white;
        font-weight: $font-weight-bold;
    }
}

/* --- 下方內容區塊 --- */
.receipt-content {
    min-height: 80px; // 預留空間避免切換時高度劇烈跳動
}

.hint-text {
    font-size: var(--app-font-size-sm); // 14px / 16px
    line-height: $line-height-relaxed;
    margin: 0;
}

/* --- 載具 / 統編 輸入框 --- */
.form-control-dark {
    background-color: transparent;
    border: 1px solid rgba($white, 0.3);
    border-radius: var(--app-radius-sm); // 對齊按鈕圓角
    color: $white;
    padding: var(--gap-sm) var(--gap-md);
    font-size: var(--app-font-size-base);
    transition: border-color 0.2s ease;

    &::placeholder {
        color: rgba($white, 0.4);
    }

    &:focus {
        outline: none;
        border-color: $white;
    }
}

/* --- 捐贈發票清單與自訂 Radio --- */
.donate-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.donate-item {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-md) 0; // 上下間距撐開點擊範圍
    border-bottom: 1px solid rgba($white, 0.1);
    transition: opacity 0.2s ease;

    &:last-child {
        border-bottom: none;
    }

    @include hover-focus {
        opacity: 0.8;
    }
}

// 手刻質感圓形單選框
.custom-radio {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid rgba($white, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;

    .radio-inner {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: $white;
        transform: scale(0);
        transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
}

.donate-item.is-selected {
    .custom-radio {
        border-color: $white;

        .radio-inner {
            transform: scale(1);
        }
    }
}

/* --- 微過渡動畫 --- */
.fade-in {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.cursor-pointer {
    cursor: pointer;
}
</style>