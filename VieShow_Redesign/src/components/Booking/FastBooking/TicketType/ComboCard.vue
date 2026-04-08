<template>
  <div class="combo-card" :class="{ 'combo-card--active': item.quantity > 0 }">
    <!-- 套票圖片（小縮圖） -->
    <div class="combo-card__img-wrapper">
      <img :src="item.image" :alt="item.name" class="combo-card__img" />
    </div>

    <!-- 套票資訊 -->
    <div class="combo-card__body">
      <h4 class="combo-card__name">{{ item.name }}</h4>
      <p class="combo-card__desc mb-4">{{ item.description }}</p>

      <!-- 價格 + 計數器（替換為 StepperCounter）-->
      <div class="combo-card__footer">
        <span class="combo-card__price">NT {{ item.price.toLocaleString() }}</span>

        <StepperCounter
          :model-value="item.quantity"
          :min="0"
          :max="4"
          @update:model-value="(val) => $emit('update-qty', item.id, val - item.quantity)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import StepperCounter from '@/components/Booking/FastBooking/Button/StepperCounter.vue'

defineProps({
  item: {
    type: Object,
    required: true,
  },
})

defineEmits(['update-qty'])
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.combo-card {
  display: flex;
  flex-direction: column;
  width: 245px;
  padding: $container-padding-mobile;
  flex-shrink: 0;
  background: rgba($white, 0.05);
  border: 1px solid rgba($white, 0.1);
  border-radius: $border-radius-lg-mobile;     // 12px
  overflow: hidden;
  transition: border-color 0.25s ease, background 0.25s ease;

  &--active {
    background: rgba($vieshow-primary, 0.08);
    border-color: rgba($vieshow-primary, 0.6);
  }
}

// ── 圖片縮圖（小正方形）──────────────────────────────────────
.combo-card__img-wrapper {
  width: 80px;
  height: 80px;
  border-radius: $border-radius-mobile;        // 8px
  overflow: hidden;
  background: rgba($white, 0.06);
  flex-shrink: 0;
}

.combo-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

// ── 文字區 ─────────────────────────────────────────────────────
.combo-card__body {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs-mobile;                     // 4px
  padding-top: $spacing-sm-mobile;
  flex: 1;
}

.combo-card__name {
  margin: 0;
  font-size: $font-size-base-mobile;           // 16px
  font-weight: 700;
  color: $light;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.combo-card__desc {
  margin: 0;
  font-size: $font-size-mini-mobile;           // 12px
  color: $vieshow-tertiary;
  line-height: $line-height-relaxed;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

// ── 底部：價格 + 計數器 ────────────────────────────────────────
.combo-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: $spacing-xs-mobile;
}

.combo-card__price {
  font-size: $font-size-sm-mobile;             // 14px
  font-weight: 700;
  color: $vieshow-danger;
}
</style>