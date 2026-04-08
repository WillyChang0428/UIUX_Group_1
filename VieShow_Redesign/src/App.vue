<template>
  <div class="app-wrapper">
    <main class="main-wrapper">
      <div class="container">
        
        <FoodAddon @update="onFoodUpdate" />
        <Ticket/>

        <!-- 已選餐點摘要（測試用） -->
        <div v-if="selectedFoods.length > 0" class="mt-3">
          <p class="small text-secondary mb-1">已選餐點：</p>
          <div class="d-flex flex-wrap gap-2">
            <span
              v-for="item in selectedFoods"
              :key="item.id"
              class="badge bg-primary"
            >
              {{ item.name }} × {{ item.quantity }}
            </span>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FoodAddon from '@/components/Booking/FastBooking/FoodAddOn.vue'
import Ticket from '@/components/Booking/FastBooking/TicketType/TicketSelector.vue'

const selectedFoods = ref([])
const onFoodUpdate = (items) => { selectedFoods.value = items }

</script>

<style lang="scss">
@import "@/assets/scss/main";

.app-wrapper {
  min-height: 100vh;
  background: v.$vieshow-gradient-dark;
}
</style>