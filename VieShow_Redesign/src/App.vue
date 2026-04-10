<template>
  <div class="app-wrapper">
    <div class="container py-5">

      <h5 class="text-white mb-4">票種說明（點選 ？ 開啟彈窗）</h5>

      <div class="d-flex flex-column gap-3">

        <!-- 優待票 -->
        <div class="ticket-row d-flex align-items-center gap-2">
          <span class="ticket-name">優待票</span>
          <button class="info-btn" @click="openDiscount" aria-label="優待票說明">
            <i class="fa-solid fa-circle-question"></i>
          </button>
        </div>

        <!-- 免費兌換券 -->
        <div class="ticket-row d-flex align-items-center gap-2">
          <span class="ticket-name">免費兌換券</span>
          <button class="info-btn" @click="openFree" aria-label="免費兌換券說明">
            <i class="fa-solid fa-circle-question"></i>
          </button>
        </div>

        <!-- 敬老/愛心票 -->
        <div class="ticket-row d-flex align-items-center gap-2">
          <span class="ticket-name">敬老/愛心票</span>
          <button class="info-btn" @click="openLove" aria-label="敬老愛心票說明">
            <i class="fa-solid fa-circle-question"></i>
          </button>
        </div>

        <!-- 團體票 -->
        <div class="ticket-row d-flex align-items-center gap-2">
          <span class="ticket-name">團體票</span>
          <button class="info-btn" @click="openGroup" aria-label="團體票說明">
            <i class="fa-solid fa-circle-question"></i>
          </button>
        </div>

      </div>

      <!-- 四個彈窗，各自獨立控制 -->
      <DiscountTickets v-model="showDiscount" />
      <FreeVoucher     v-model="showFree" />
      <LoveTickets     v-model="showLove" />
      <GroupTickets    v-model="showGroup" />

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DiscountTickets from '@/components/Booking/Tips/DiscountTickets.vue'
import FreeVoucher     from '@/components/Booking/Tips/FreeVoucher.vue'
import LoveTickets     from '@/components/Booking/Tips/LoveTickets.vue'
import GroupTickets    from '@/components/Booking/Tips/GroupTickets.vue'

const showDiscount = ref(false)
const showFree     = ref(false)
const showLove     = ref(false)
const showGroup    = ref(false)

const openDiscount = () => { showDiscount.value = true }
const openFree     = () => { showFree.value     = true }
const openLove     = () => { showLove.value     = true }
const openGroup    = () => { showGroup.value    = true }
</script>

<style lang="scss">
@import "@/assets/scss/main";

.app-wrapper {
  min-height: 100vh;
  background: $vieshow-gradient-dark;
}

.ticket-row {
  background: $vieshow-dark-section;
  border-radius: 8px;
  padding: 12px 16px;
}

.ticket-name {
  font-size: $font-size-base-mobile;
  color: $white;
  font-weight: 600;
}

.info-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: $vieshow-secondary;
  font-size: 18px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s ease;

  &:hover { color: $white; }
}
</style>