<template>
      <div class="container  d-flex flex-column gap-6 py-5">


        <SeatMap :ticket-count="ticketCount" @open-panorama="onPanorama" @seats-selected="onSeatsSelected" />

      </div>
</template>

<script setup>
import { ref } from "vue";
import SeatMap from "@/components/Booking/Button/SeatSelecting/SeatMap.vue";

const ticketCount = ref(2);
const selectedSeats = ref([]);

const onPanorama = () => console.log("開啟全景");
const onSeatsSelected = (seats) => {
  selectedSeats.value = seats;
  console.log("已選座位：", seats);
};
</script>

<style lang="scss">

</style>
