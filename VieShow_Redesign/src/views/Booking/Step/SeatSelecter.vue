<template>
  <div class="container d-flex flex-column gap-6 py-5">
    <SeatMap :ticket-count="ticketCount" :initial-seats="selectedSeats" @open-panorama="onPanorama" @seats-selected="onSeatsSelected" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useBookingStore } from "@/store/bookingStore";
import SeatMap from "@/components/Booking/Button/SeatSelecting/SeatMap.vue";

const bookingStore = useBookingStore();

// 💡 1. 自動從 Store 取得總票數 (套票已在 Store 自動乘 2)
const ticketCount = computed(() => bookingStore.totalTicketCount);
const selectedSeats = ref([]);

// 💡 2. 進場時自動預選座位
onMounted(() => {
  if (bookingStore.selectedSeats.length === 0 && ticketCount.value > 0) {
    const autoSeats = [];
    // 簡單模擬：預設從 F 排 1 號開始劃位
    for (let i = 1; i <= ticketCount.value; i++) {
      autoSeats.push(`F${i}`); 
    }
    selectedSeats.value = autoSeats;
    bookingStore.updateSeats(autoSeats);
  } else {
    // 支援上一頁返回時保留紀錄
    selectedSeats.value = bookingStore.selectedSeats;
  }
});

const onPanorama = () => console.log("開啟全景");

const onSeatsSelected = (seats) => {
  selectedSeats.value = seats;
  bookingStore.updateSeats(seats); // 同步到 Store
};
</script>

<style lang="scss">

</style>
