<template>
  <div class="container-mb py-5">
    <ProgressStep class="mb-4" :currentStep="1" :totalSteps="totalSteps" />
    <!-- 限定套票 -->
    <ComboSlider />

    <!-- 分隔線 -->
    <hr class="section-divider" />

    <!-- 一般票種 + 其他票種 -->
    <TicketSelector />
  </div>
</template>

<script setup>
import ComboSlider from "@/components/Booking/Button/TicketType/ComboSlider.vue";
import TicketSelector from "@/components/Booking/Button/TicketType/TicketSelector.vue";
import ProgressStep from "@/components/Common/ProgressStep.vue";

</script>

<style lang="scss" scoped>
@import "@/assets/scss/main";

.app-wrapper {
  min-height: 100vh;
  background: $vieshow-gradient-dark;
}

.section-divider {
  border: none;
  border-top: 1px solid rgba($white, 0.08);
  margin: $spacing-md-mobile 0;
}
</style>
