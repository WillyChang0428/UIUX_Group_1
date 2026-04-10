<template>
    <div class="receipt-option-container cursor-pointer" @click="goToSetting">
        <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex flex-column">
                <span class="fs-5 fw-bold text-white mb-1">{{ displayTitle }}</span>
                <span class="text-secondary hint-text">{{ displaySubtitle }}</span>
            </div>
            <div class="arrow-icon ms-3">
                <i class="fa-solid fa-chevron-right text-white fs-5"></i>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBookingStore } from '@/store/bookingStore';

const router = useRouter();
const bookingStore = useBookingStore();

// ── 內部對照表 ──────────────────────────────
const charityMap = {
    'c1': '台灣之心愛護動物協會', 'c2': '台灣流浪貓狗關懷協會',
    'c3': '台灣世界展望會', 'c4': '罕見疾病基金會',
    'c5': '勵馨基金會', 'c6': '紅鼻子關懷小丑協會'
};

// ── 動態計算顯示文字 (直接監聽 Store 的資料) ────────
const displayTitle = computed(() => {
    switch (bookingStore.receipt.type) {
        case 'personal-e': return '個人 - 電子發票';
        case 'mobile-barcode': return '個人 - 手機條碼載具';
        case 'company-e': return '公司 - 電子發票';
        case 'donate': return '捐贈發票';
        default: return '請選擇發票設定';
    }
});

const displaySubtitle = computed(() => {
    const data = bookingStore.receipt; // 💡 從 Store 抓資料

    switch (data.type) {
        case 'personal-e':
            return '威秀影城全面採電子發票，不主動寄出，發票號碼將上傳至政府平台';
        case 'mobile-barcode':
            return data.barcode ? `載具：${data.barcode}` : '尚未設定手機條碼載具';
        case 'company-e':
            return data.taxId ? `統一編號：${data.taxId}` : '尚未設定統一編號';
        case 'donate':
            return data.charityId ? `捐贈單位：${charityMap[data.charityId] || '未知單位'}` : '尚未選擇捐贈單位';
        default: return '';
    }
});

// ── 路由跳轉邏輯 ──────────────────────────────
const goToSetting = () => {
    // 💡 假設您在 router/index.js 設定的發票頁面路徑叫做 /booking/receipt
    router.push('/booking/receipt');
};
</script>

<style lang="scss" scoped>
/* 💡 遵守變數手冊，統一使用 @import 並且拔除 v. 前綴 [cite: 79, 139] */
@import "@/assets/scss/variables";

.receipt-option-container {
    border: 1px solid rgba($white, 0.2);
    border-radius: var(--app-radius-lg);
    background-color: transparent;
    padding: var(--gap-md); // 💡 使用變數手冊中的間距系統 (16px / 32px) [cite: 144, 145]
    transition: all 0.2s ease;

    @include hover-focus {
        background-color: rgba($white, 0.05);
    }
}

.hint-text {
    font-size: var(--app-font-size-sm); // 💡 使用變數手冊中的字體系統 [cite: 158]
    line-height: $line-height-relaxed; // 💡 使用 _variables.scss 中定義的行高 [cite: 123]
    margin: 0;

    // 避免文字過長換行破版，使用單行截斷 (針對手機載具條碼等情況)
    white-space: wrap;
    overflow: hidden;
    text-overflow: ellipsis;

    // 若是個人電子發票那句長敘述，可以視情況允許換行，或維持單行截斷
    // 若希望這句長敘述能夠換行，可以考慮加上特定 class 來覆寫 white-space
}

.arrow-icon {
    flex-shrink: 0; // 防止箭頭被長文字擠壓變形
    transition: transform 0.2s ease;
}

// 點擊互動感
.cursor-pointer {
    cursor: pointer;

    &:active {
        .arrow-icon {
            transform: translateX(4px); // 點擊時箭頭微動
        }
    }
}
</style>