<template>
    <div class="HeaderBg">
<div class="container pt-4 d-flex justify-content-between align-items-center">
    <div class="clickable-icon h2"><i class="fa-solid fa-bars text-white"></i></div>
    <div class="logo"><img src="../../../assets/images/LOGO.png" alt="Logo"></div>
    <div class="clickable-icon h2"><i class="fa-solid fa-user text-white font-size-20"></i></div>
</div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

</script>

<style scoped lang="scss">
.HeaderBg {
    background: v.$vieshow-gradient-primary;
    width: 100%;
    height: 134px;
    display: flex;
    align-items: center;
}

.logo {
    width: 158px;
    height: 86px;
    img{
        width: 100%;
    }
}
</style>