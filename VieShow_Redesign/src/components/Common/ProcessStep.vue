<!--使用方式
<ProgressStep :currentStep="currentStep" :totalSteps="4" />
    
    <div class="d-flex gap-3 mt-4">
      <BaseButton @click="currentStep--" :is-disabled="currentStep <= 1">上一步</BaseButton>
      <BaseButton @click="currentStep++" :is-disabled="currentStep >= 4">下一步</BaseButton>
    </div>
</div> -->

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
