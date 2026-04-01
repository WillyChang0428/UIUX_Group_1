<script setup>
import SelectBox from '@/components/Common/Selecter/SelectBox.vue'
import Header from '@/components/Layout/Parts/Header.vue'
import SecondaryButton from '@/components/Common/Button/SecondaryButton.vue'
import PrimaryButton from '@/components/Common/Button/PrimaryButton.vue'
import MiniButton from '@/components/Common/Button/MiniButton.vue'
</script>

<template>
    <SelectBox />
    <Header />
    <SecondaryButton>立即訂票</SecondaryButton>
    <PrimaryButton status="secondary">立即訂票</PrimaryButton>
    <MiniButton>立即訂票</MiniButton>
</template>

<style lang="scss">
body {
    height: 100vh;
    background: v.$vieshow-gradient-dark;
    padding: 133px 0 0;
    /* 預留 Header 的高度 */
};
</style>
