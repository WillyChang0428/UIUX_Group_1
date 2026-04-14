<template>
  <header class="header-bg fixed-top">
    <div
      class="container d-flex justify-content-between align-items-center h-100"
    >
      <div
        class="clickable-icon h5 mb-0 d-lg-none order-1"
        @click="isMenuOpen = !isMenuOpen"
      >
        <i
          :class="[
            'fa-solid',
            isMenuOpen ? 'fa-xmark' : 'fa-bars',
            'text-white',
          ]"
        ></i>
      </div>

      <router-link class="logo-wrapper order-2 order-lg-1" to="/">
        <img src="@/assets/images/LOGO.png" alt="Logo" class="img-fluid" />
      </router-link>

      <nav
        class="desktop-nav d-none d-lg-flex align-items-center gap-4 order-lg-2"
      >
        <router-link
          v-for="item in menuItems"
          :key="item.text"
          :to="item.link"
          class="nav-link text-white fw-regular"
        >
          {{ item.text }}
        </router-link>
      </nav>

      <div
        class="action-zone d-flex align-items-center gap-2 order-3 order-lg-3"
      >
        <router-link
          to="/fastbooking"
          class="btn btn-light py-1 rounded-pill fw-medium text-primary d-none d-lg-block"
        >
          快速訂票
        </router-link>

        <div
          v-if="!authStore.isLoggedIn"
          @click="isLoginOpen = true"
          class="clickable-icon h5 mb-0 text-decoration-none"
        >
          <i class="fa-regular fa-user text-white"></i>
        </div>

        <div v-else class="dropdown d-flex align-items-center">
          <div
            class="clickable-icon h5 mb-0"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="fa-solid fa-user text-white"></i>
            <i class="fa-solid fa-caret-down text-white fs-6"></i>
          </div>

          <ul class="dropdown-menu dropdown-menu-end shadow-sm mt-2 border-0">
            <li>
              <span class="dropdown-item-text fw-medium text-primary me-1">
                嗨，{{ authStore.currentUser?.realName }}
              </span>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <router-link
                class="dropdown-item text-decoration-none"
                to="/profile"
                >會員中心</router-link
              >
            </li>
            <li>
              <a
                class="dropdown-item text-danger text-decoration-none"
                href="#"
                @click.prevent="handleLogout"
                >登出</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>

  <NavMenu :show="isMenuOpen" @close="isMenuOpen = false" />

  <LoginView v-model="isLoginOpen" />
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import NavMenu from "./NavMenu.vue";
// 💡 修改處 3：引入登入彈窗組件 (請確認您的路徑是否正確)
import LoginView from "@/views/Auth/LoginView.vue";

const isMenuOpen = ref(false);
// 💡 修改處 4：新增控制登入彈窗開關的變數
const isLoginOpen = ref(false);

const router = useRouter();
const authStore = useAuthStore();

const menuItems = [
  { text: "電影資訊", link: "/movieinfo" },
  { text: "影城據點", link: "/" },
  { text: "最新消息", link: "/" },
  { text: "團票 / 包廳", link: "/" },
];

const handleLogout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<style scoped lang="scss">
// 💡 CSS 完全沒有更動，保留您原本寫好的響應式與樣式配置
.header-bg {
  background: v.$vieshow-gradient-primary;
  height: v.$web-top-padding-mobile;
  z-index: 1050;
  display: flex;
  align-items: center;
  padding: 0;

  @include v.media-breakpoint-up(md) {
    height: v.$web-top-padding-pc;
    padding: 0;
  }
}

.desktop-nav {
  .nav-link {
    text-decoration: none;
    font-size: 16px;
    transition: opacity 0.3s;

    &:hover {
      opacity: 0.8;
    }
  }
}

.logo-wrapper {
  width: 120px;

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
  min-width: 45px;
  justify-content: flex-end;
}

.btn-light {
  text-decoration: none;
}
</style>
