<template>
  <div class="container d-flex flex-column gap-3 py-5 position-relative">
    <ProgressStep class="mb-4" :currentStep="4" :totalSteps="totalSteps" />
    <OrderSummary />
    
    <iShowCash 
      :checkoutTotal="finalTotal" 
      :currentMethod="bookingStore.paymentMethod" 
      @select="handlePaymentSelect" 
      @topup-success="handleTopUpSuccess" 
    />
    
    <CreditCard 
      :currentMethod="bookingStore.paymentMethod" 
      @select="handlePaymentSelect" 
      @card-saved="handleCardSaved" 
    />
    
    <div class="payment-page">
        <ReceiptOption />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'; // 💡 記得引入 onMounted
import { useBookingStore } from '@/store/bookingStore';

import OrderSummary from '@/components/Booking/ConfirmationPage/OrderSummary.vue';
import iShowCash from '@/components/Booking/Button/Paying/iShowCash.vue';
import CreditCard from '@/components/Booking/Button/Paying/CreditCard.vue';
import ReceiptOption from '@/components/Booking/Button/Paying/ReceiptOption.vue';
import ProgressStep from "@/components/Common/ProgressStep.vue";


const bookingStore = useBookingStore();

const finalTotal = computed(() => bookingStore.finalTotal);

// 💡 進到付款頁時，如果還沒選過付款方式，預設設定為儲值金
onMounted(() => {
    if (!bookingStore.paymentMethod) {
        bookingStore.setPaymentMethod('ishowCash');
    }
});

const handlePaymentSelect = (method) => {
    // 收到子元件傳來的選擇後，寫入大腦
    bookingStore.setPaymentMethod(method); 
};

const handleTopUpSuccess = () => {
    console.log('儲值成功！');
};

const handleCardSaved = () => {
    console.log('信用卡資訊已儲存！');
};
</script>