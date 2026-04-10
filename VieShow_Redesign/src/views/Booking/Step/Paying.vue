<template>
  <div class="container d-flex flex-column gap-3 py-5 position-relative">
    <OrderSummary />
    
    <iShowCash :checkoutTotal="finalTotal" @select="handlePaymentSelect" @topup-success="handleTopUpSuccess" />
    <CreditCard @select="handlePaymentSelect" @card-saved="handleCardSaved" />
    
    <div class="payment-page">
        <ReceiptOption />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBookingStore } from '@/store/bookingStore';

import OrderSummary from '@/components/Booking/ConfirmationPage/OrderSummary.vue';
import iShowCash from '@/components/Booking/Button/Paying/iShowCash.vue';
import CreditCard from '@/components/Booking/Button/Paying/CreditCard.vue';
import ReceiptOption from '@/components/Booking/Button/Paying/ReceiptOption.vue';

const bookingStore = useBookingStore();

// 從 Store 拿總金額
const finalTotal = computed(() => bookingStore.finalTotal);

// 💡 當使用者選擇付款方式時，存進 Store 大腦中
const handlePaymentSelect = (method) => {
    console.log('使用者選擇了付款方式:', method);
    bookingStore.setPaymentMethod(method); 
};

const handleTopUpSuccess = () => {
    console.log('儲值成功！');
};

const handleCardSaved = () => {
    console.log('信用卡資訊已儲存！');
};
</script>