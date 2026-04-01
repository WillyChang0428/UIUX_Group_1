<script setup>

</script>

<template>
  <!-- <router-view/> -->
<div class="background">
        <div class="ProgressStep progress1">
            <div class="circle circle-active"></div>
            <div class="line"></div>
            <div class="circle"></div>
            <div class="line"></div>
            <div class="circle"></div>
            <div class="line"></div>
            <div class="circle"></div>
        </div>
        <div class="ProgressStep progress2">
            <div class="circle circle-active"></div>
            <div class="line line-active"></div>
            <div class="circle circle-active"></div>
            <div class="line"></div>
            <div class="circle"></div>
            <div class="line"></div>
            <div class="circle"></div>
        </div>
        <div class="ProgressStep progress3">
            <div class="circle circle-active"></div>
            <div class="line line-active"></div>
            <div class="circle circle-active"></div>
            <div class="line line-active"></div>
            <div class="circle circle-active"></div>
            <div class="line"></div>
            <div class="circle"></div>
        </div>
        <div class="ProgressStep progress4">
            <div class="circle circle-active"></div>
            <div class="line line-active"></div>
            <div class="circle circle-active"></div>
            <div class="line line-active"></div>
            <div class="circle circle-active"></div>
            <div class="line line-active"></div>
            <div class="circle circle-active"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
/* 你的全域樣式 */
    .background{
    width: 500px;
    height: 500px;
    background-color: black;
    display: flex;
    flex-direction: column;
    gap: 50px;
    align-items: center;
    padding-top: 50px;
    }
    .ProgressStep{
        display: flex;
        align-items: center;
        gap: 16px;
    }
    .circle {
    width: 10px;
    height: 10px;
    background-color: #4A4A4A;
    border-radius: 50%;
    filter: drop-shadow(0px 0px 11px rgba(47, 150, 238, 1));
    }

    .circle-active {
        background-color:#FFFFFF;
        filter: drop-shadow(0px 0px 11px rgba(47, 150, 238, 1));
    }

    .line{
        width: 40px;
        height: 1px;
        background-color: #4A4A4A;
        border-radius: 50%;
    }

    .line-active {
        background-color:v.$white;
    }
</style>
