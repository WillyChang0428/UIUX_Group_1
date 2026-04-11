<template>
  <div class="legend-wrapper">
    <div class="legend-item">
      <SeatButton size="sm" state="available" class="pointer-events-none" />
      <span>空位</span>
    </div>
    <div class="legend-item">
      <SeatButton size="sm" state="selected" class="pointer-events-none" />
      <span>已選</span>
    </div>
    <div class="legend-item">
      <SeatButton size="sm" state="sold" class="pointer-events-none" />
      <span>佔位</span>
    </div>
    <div class="legend-item">
      <SeatButton size="sm" state="wheelchair" class="pointer-events-none" />
      <span>輪椅位須至影城購買</span>
    </div>
  </div>
</template>

<script setup>
import SeatButton from "@/components/Booking/Button/SeatButton.vue";
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.legend-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--gap-sm);
  border-top: 1px solid rgba($white, 0.08);
  padding-top: 24px;
  margin-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: $light;
  font-size: var(--app-font-size-sm);
}

.pointer-events-none {
  pointer-events: none;
}
</style>