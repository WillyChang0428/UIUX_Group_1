<template>
  <div class="app-wrapper">
    <main class="main-wrapper">
      <div class="container">

        <p class="text-white fw-bold mb-3">選位測試（需選 {{ ticketCount }} 個座位）</p>

        <SeatMap
          :ticket-count="ticketCount"
          @open-panorama="onPanorama"
          @seats-selected="onSeatsSelected"
        />

        <!-- 已選座位顯示 -->
        <div v-if="selectedSeats.length > 0" class="mt-3">
          <p class="text-secondary small mb-1">已選座位：</p>
          <div class="d-flex flex-wrap gap-2">
            <span
              v-for="seat in selectedSeats"
              :key="seat.key"
              class="badge bg-primary"
            >
              {{ seat.row }} 排 {{ seat.col }} 號
            </span>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SeatMap from '@/components/Booking/FastBooking/SeatSelecting/SeatMap.vue'

const ticketCount = ref(2)
const selectedSeats = ref([])

const onPanorama = () => console.log('開啟全景')
const onSeatsSelected = (seats) => {
  selectedSeats.value = seats
  console.log('已選座位：', seats)
}
</script>

<style lang="scss">
@import "@/assets/scss/main";

.app-wrapper {
  min-height: 100vh;
  background: $vieshow-gradient-dark;
}
</style>