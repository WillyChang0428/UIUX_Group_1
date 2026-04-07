<template>
  <header class="header-bg fixed-top">
    <div class="container d-flex justify-content-between align-items-center h-100">
      
      <div 
        class="clickable-icon h2 mb-0 d-lg-none order-1" 
        @click="isMenuOpen = !isMenuOpen"
      >
        <i :class="['fa-solid', isMenuOpen ? 'fa-xmark' : 'fa-bars', 'text-white']"></i>
      </div>

      <div class="logo-wrapper order-2 order-lg-1">
        <img src="@/assets/images/LOGO.png" alt="Logo" class="img-fluid" />
      </div>

      <nav class="desktop-nav d-none d-lg-flex align-items-center gap-4 order-lg-2">
        <router-link 
          v-for="item in menuItems" 
          :key="item.text" 
          :to="item.link" 
          class="nav-link text-white fw-bold"
        >
          {{ item.text }}
        </router-link>
      </nav>

      <div class="action-zone d-flex align-items-center gap-2 order-3 order-lg-3">
        <router-link 
          to="/booking" 
          class="btn btn-light rounded-pill px-lg-2 py-lg-1 fw-bold text-primary d-none d-lg-block"
        >
          快速訂票
        </router-link>

        <div class="clickable-icon h2 mb-0">
          <i class="fa-solid fa-user text-white"></i>
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
  height: v.$web-top-padding-mobile; // [cite: 121]
  z-index: 1050;
  display: flex;
  align-items: center;

  @include v.media-breakpoint-up(md) {
    height: v.$web-top-padding-pc; // [cite: 121]
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
  
  // 💡 手機版 CSS 修正：確保 Logo 在 header 內水平絕對置中
  @include v.media-breakpoint-down(lg) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  @include v.media-breakpoint-up(lg) {
    position: relative;
    left: 0;
    transform: none;
  }
}

.action-zone {
  // 💡 在手機版確保功能區不會擠壓到置中的 Logo
  min-width: 45px; 
  justify-content: flex-end;
}

.btn-light{
  text-decoration:none;
}
</style>