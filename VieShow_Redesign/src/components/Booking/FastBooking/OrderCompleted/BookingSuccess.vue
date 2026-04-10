<template>
  <div class="booking-success d-flex flex-column align-items-center justify-content-center">

    <!-- 成功 icon：圓形 + 勾勾 -->
    <div class="booking-success__icon-wrap">
      <i class="fa-solid fa-check booking-success__icon"></i>
    </div>

    <!-- 標題 -->
    <h2 class="booking-success__title">訂票成功</h2>

    <!-- 說明文字 + email -->
    <div class="booking-success__desc">
      <p class="mb-0">訂單明細已發送至</p>
      <p class="mb-0 booking-success__email">{{ email }}</p>
    </div>

  </div>
</template>

<script setup>
defineProps({
  // 串接時由父層（view）傳入使用者 email
  email: {
    type: String,
    default: 'vscinemas0323@gmail.com',
  },
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

// ── 整體：垂直置中 ─────────────────────────────────────────────
.booking-success {
  width: 100%;
  // 上下留空讓內容自然置中
  padding: var(--gap-4xl) var(--gap-lg);
  gap: var(--gap-md);

  @include media-breakpoint-up(md) {
    padding: var(--gap-4xl) var(--gap-2xl);
    gap: var(--gap-lg);
  }
}

// ── 圓形 icon 外框 ─────────────────────────────────────────────
.booking-success__icon-wrap {
  // 圓形固定尺寸：設計稿約 80px，不寫死，用 gap 變數堆出
  width: calc(var(--gap-4xl) + var(--gap-lg));   // 72+24 = 96px 手機 / 144+48 = 192px PC
  height: calc(var(--gap-4xl) + var(--gap-lg));
  border-radius: 50%;
  border: 2px solid v.$white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

// ── 勾勾 icon ─────────────────────────────────────────────────
.booking-success__icon {
  // 手機 icon-md 24px / PC 48px 自動縮放
  font-size: var(--gap-lg);                      // 24px / 48px
  color: v.$white;
}

// ── 標題「訂票成功」──────────────────────────────────────────
.booking-success__title {
  margin: 0;
  // h4 等級：手機 24px / PC 26px
  font-size: var(--app-font-size-h4);
  font-weight: 700;
  color: v.$white;
  letter-spacing: 0.04em;
}

// ── 說明文字區 ─────────────────────────────────────────────────
.booking-success__desc {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-xs);
  // 輔助文 Sm：手機 14px / PC 16px
  font-size: var(--app-font-size-sm);
  color: $white;
  text-align: center;
  line-height: 1.6;
}
</style>