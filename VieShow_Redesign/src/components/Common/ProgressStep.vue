<!--使用方式
<script setup>
import { ref } from 'vue';
import ProgressStep from './components/Common/ProgressStep.vue';
import SecondaryButton from './components/Common/Button/SecondaryButton.vue';

// 💡 必須在父層定義響應式變數
const currentStep = ref(1);
const totalSteps = 4;
</script>

<template>
  <ProgressStep :currentStep="currentStep" :totalSteps="totalSteps" />

  <div class="d-flex gap-3 mt-4">
    <SecondaryButton @click="currentStep > 1 && currentStep--" :isDisabled="currentStep <= 1">上一步</SecondaryButton>

    <SecondaryButton @click="currentStep < totalSteps && currentStep++" :isDisabled="currentStep >= totalSteps">下一步
    </SecondaryButton>
  </div>
</template>
 -->

<script setup>

const props = defineProps({
    // 目前進行到第幾步 (1, 2, 3...)
    currentStep: {
        type: Number,
        default: 1
    },
    // 總共有幾步
    totalSteps: {
        type: Number,
        default: 4
    }
})
</script>

<template>
    <div class="progress-container">
        <template v-for="n in totalSteps" :key="'step-' + n">
            <div class="circle" :class="{ 'circle-active': n <= currentStep }"></div>

            <div v-if="n < totalSteps" class="line" :class="{ 'line-active': n < currentStep }"></div>
        </template>
    </div>
</template>

<style scoped lang="scss">
.progress-container {
    width: 100%;
    max-width: 500px;
    padding: 24px 64px;
    display: flex;
    margin: 0 auto;
    align-items: center;
    justify-content: space-between;
}

.circle {
    width: 10px;
    height: 10px;
    background-color: v.$vieshow-secondary-emp; // #4A4A4A
    border-radius: 50%;
    transition: all 0.3s ease;

    &.circle-active {
        background-color: v.$white;
        // 使用你原本的發光效果
        filter: drop-shadow(0px 0px 5px rgba(47, 150, 238, 1));
    }
}

.line {
    flex-grow: 1; // 讓線條自動撐開間距
    margin: 0 10px;
    height: 1px;
    background-color: v.$vieshow-secondary-emp; // #4A4A4A
    transition: all 0.3s ease;

    &.line-active {
        background-color: v.$white;
    }
}
</style>
