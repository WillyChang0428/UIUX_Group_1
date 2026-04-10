<template>
    <div class="container pt-3  d-flex flex-column gap-3 pb-5">
        <OrderSummary />
        <iShowCash :checkoutTotal="finalTotal" @select="handlePaymentSelect" @topup-success="handleTopUpSuccess" />
        <CreditCard @select="handlePaymentSelect" @card-saved="handleCardSaved" />
        <div class="payment-page">
            <ReceiptOption />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import OrderSummary from '@/components/Booking/ConfirmationPage/OrderSummary.vue'
import iShowCash from '@/components/Booking/Button/Paying/iShowCash.vue'
import CreditCard from '@/components/Booking/Button/Paying/CreditCard.vue'
import ReceiptOption from '@/components/Booking/Button/Paying/ReceiptOption.vue';

// 儲存目前的發票設定
const currentReceiptData = ref({
    type: 'personal-e',
    barcode: '',
    taxId: '',
    charityId: ''
});

const isModalOpen = ref(false);

const openReceiptModal = () => {
    isModalOpen.value = true;
};

// 接收來自 ReceiptSetting 的資料更新
const handleReceiptUpdate = (newData) => {
    currentReceiptData.value = newData;
    // 如果收到的是從「儲存」按鈕發送的完整資料，通常會在這裡順便關閉 Modal
    // isModalOpen.value = false; 
};


</script>


<style lang="scss">
html,
body,
#app {
    height: fit-content;
    background: v.$vieshow-gradient-dark;
}
</style>
