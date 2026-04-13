<template>
  <div class="d-flex flex-column gap-4 container py-5">
    <ProgressStep :currentStep="2" :totalSteps="totalSteps" />
    <SeatMap
      :ticketCount="bookingStore.totalTicketCount"
      @seats-selected="handleSeatUpdate"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useBookingStore } from "@/store/bookingStore";
import SeatMap from "@/components/Booking/Button/SeatSelecting/SeatMap.vue";
import ProgressStep from "@/components/Common/ProgressStep.vue";

const bookingStore = useBookingStore();
const ticketCount = computed(() => bookingStore.totalTicketCount);

// 💡 修正 1：函式名稱改為 handleSeatUpdate，與 template 完全對應
const handleSeatUpdate = (seats) => {
  bookingStore.updateSeats(seats); // 將 SeatMap 傳來的物件陣列同步到 Store
};

// 💡 修正 2：修改自動預選座位的資料格式
onMounted(() => {
  if (bookingStore.selectedSeats.length === 0 && ticketCount.value > 0) {
    const autoSeats = [];
    // 預設從 F 排 1 號開始劃位
    for (let i = 1; i <= ticketCount.value; i++) {
      // 必須存入含有 rowLabel 與 colLabel 的「物件」
      autoSeats.push({
        rowLabel: 'F',
        colLabel: i
      });
    }
    bookingStore.updateSeats(autoSeats);
  }
  // (不用特別寫 else，因為我們之前在 Layout 加了 <keep-alive>，加上 Store 已經有資料，畫面會自己維持狀態)
});
</script>

<style lang="scss"></style>
