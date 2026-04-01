<script setup>
import Header from '@/components/Layout/Parts/Header.vue'
import ProcessStep from '@/components/Common/ProcessStep.vue'

</script>

<template>
  <router-view />
<header>
  <Header />
  <ProcessStep />
</header>
</template>

<style lang="scss">
/* 你的全域樣式 */
body {
  height: 100vh;
  background: v.$vieshow-gradient-dark;
  padding: 133px 0 0; /* 預留 Header 的高度 */
}
</style>
