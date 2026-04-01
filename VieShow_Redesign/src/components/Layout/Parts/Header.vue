<template>
  <div class="HeaderBg fixed-top pt-6">
    <div class="container d-flex justify-content-between align-items-center">
      <div class="clickable-icon h2" @click="isMenuOpen = !isMenuOpen">
        <i :class="['fa-solid', isMenuOpen ? 'fa-xmark' : 'fa-bars', 'text-white']"></i>
      </div>
      
      <div class="logo">
        <img src="@/assets/images/LOGO.png" alt="Logo">
      </div>
      
      <div class="clickable-icon h2">
        <i class="fa-solid fa-user text-white"></i>
      </div>
    </div>
  </div>

  <NavMenu :show="isMenuOpen" @close="isMenuOpen = false" />
</template>

<script setup>
import { ref } from 'vue'
import NavMenu from './NavMenu.vue'

const isMenuOpen = ref(false)

</script>

<style scoped lang="scss">
.HeaderBg {
    background: v.$vieshow-gradient-primary;
    width: 100%;
    height: 134px;
    display: flex;
    align-items: center;
    z-index: 1050;
}

.logo {
    width: 158px;
    height: 86px;
    img{
        width: 100%;
    }
}
</style>