<template>
  <div class="final-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6 d-flex flex-column gap-4 gap-md-5">
          
          <BookingSuccess :email="userEmail" />

          <OrderCompleteCard 
            variant="standard" 
            ticketStatus="active" 
            :tickets="allPurchasedItems"
            @share-ticket="handleShare"
          />

          <div class="d-flex justify-content-center mt-2">
            <SecondaryButton @click="goHome">
              返回首頁
            </SecondaryButton>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';

import BookingSuccess from '@/components/Booking/OrderCompleted/BookingSuccess.vue';
import OrderCompleteCard from '@/components/Booking/OrderCompleted/OrderCompleteCard.vue';
import SecondaryButton from '@/components/Common/Button/SecondaryButton.vue';

const router = useRouter();
const authStore = useAuthStore();
const bookingStore = useBookingStore();

// 自動抓取登入會員信箱
const userEmail = computed(() => authStore.currentUser?.email || 'guest@vscinemas.com');

// 💡 核心整理：將票種、套票、加購餐飲合併成一個陣列，餵給卡片顯示
const allPurchasedItems = computed(() => {
  return [
    ...bookingStore.tickets,
    ...bookingStore.combos,
    ...bookingStore.foodAddOns
  ];
});

const handleShare = (ticketId) => {
  console.log(`觸發分享票券，項目 ID: ${ticketId}`);
};

// 返回首頁並清空訂單
const goHome = () => {
  bookingStore.resetBooking();
  router.push('/');
};
</script>

<style lang="scss" scoped>
.final-page {
  min-height: 100vh; 
}
</style>