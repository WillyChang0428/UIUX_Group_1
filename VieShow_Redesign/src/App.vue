<script setup>
import { ref } from "vue";
import TheaterFilter from "@/components/Booking/FastBooking/TheaterFilter.vue";
import DateFilter from "@/components/Booking/FastBooking/DateFilter.vue";

</script>

<template>
  <TheaterFilter />
  <DateFilter />
</template>


<style lang="scss">
@import "@/assets/scss/variables"; // 💡 確保引入地基

html, body , #app {
  height: 100vh;
  /* 使用專案定義的深色漸層 [cite: 1] */
  background: v.$vieshow-gradient-dark;
}
</style>
