<template>
  <div class="app-wrapper">
    <main class="main-wrapper">
      <div class="container">


        <SeatMap :ticket-count="ticketCount" @open-panorama="onPanorama" @seats-selected="onSeatsSelected" />

        <p class="text-white fw-bold mb-3">
          尚需選 {{ ticketCount }} 個座位
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import SeatMap from "@/components/Booking/FastBooking/SeatSelecting/SeatMap.vue";

const ticketCount = ref(2);
const selectedSeats = ref([]);

const onPanorama = () => console.log("開啟全景");
const onSeatsSelected = (seats) => {
  selectedSeats.value = seats;
  console.log("已選座位：", seats);
};
</script>

<style lang="scss">
@import "@/assets/scss/variables";

.app-wrapper {
  min-height: 100vh;
  background: v.$vieshow-gradient-dark;
}
</style>
