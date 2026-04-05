<template>
  <header class="header-bg fixed-top">
    <div class="container d-flex justify-content-between align-items-center h-100">
      <div class="logo-wrapper">
        <img src="@/assets/images/LOGO.png" alt="Logo" class="img-fluid" />
      </div>

      <nav class="desktop-nav d-none d-lg-flex align-items-center gap-4">
        <router-link 
          v-for="item in menuItems" 
          :key="item.text" 
          :to="item.link" 
          class="nav-link text-white fw-bold"
        >
          {{ item.text }}
        </router-link>
      </nav>

      <div class="action-zone d-flex align-items-center gap-3">
        <router-link to="/booking" class="btn btn-light rounded-pill px-4 py-2 px-lg-2 py-lg-1 fw-bold text-primary d-none d-lg-block">
          快速訂票
        </router-link>

        <div class="clickable-icon h2 mb-0">
          <i class="fa-solid fa-user text-white"></i>
        </div>

        <div class="clickable-icon h2 mb-0 d-lg-none" @click="isMenuOpen = !isMenuOpen">
          <i :class="['fa-solid', isMenuOpen ? 'fa-xmark' : 'fa-bars', 'text-white']"></i>
        </div>
      </div>
    </div>
  </header>

  <NavMenu :show="isMenuOpen" @close="isMenuOpen = false" />
</template>

<script setup>
import { ref } from "vue";
import NavMenu from "./NavMenu.vue";

const isMenuOpen = ref(false);

// 提取選單資料以利共用
const menuItems = [
  { text: "電影資訊", link: "/movies" },
  { text: "影城據點", link: "/theaters" },
  { text: "最新消息", link: "/news" },
  { text: "團票 / 包廳", link: "/group" },
];
</script>

<style scoped lang="scss">
.header-bg {
  background: v.$vieshow-gradient-primary; // [cite: 95]
  height: v.$web-top-padding-mobile; // 
  z-index: 1050;
  display: flex;
  align-items: center;

  @include v.media-breakpoint-up(md) {
    height: v.$web-top-padding-pc; // 
    padding: 0;
  }
}

.desktop-nav {
  .nav-link {
    text-decoration: none;
    font-size: 1.1rem;
    transition: opacity 0.3s;
    &:hover { opacity: 0.8; }
  }
}

.logo-wrapper {
  width: 158px;
}

.btn-light{
  text-decoration:none;
}
</style>