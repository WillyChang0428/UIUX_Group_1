<template>
  <Transition name="slide">
    <div v-if="show" class="app-menu-overlay w-100">
      <ul class="menu-list list-unstyled m-0 p-0 text-center">
        <li
          v-for="item in menuItems"
          :key="item.text"
          class="menu-item border-bottom"
          @mouseenter="handleMouseEnter(item)"
          @mouseleave="handleMouseLeave"
        >
          <div class="main-link-container w-100">
            <router-link
              :to="item.link"
              class="main-link d-flex flex-column py-4 text-decoration-none text-white"
              @click="handleMobileClick(item, $event)"
            >
              <span class="chinese fw-bold h2 mb-2 ls-wide">{{
                item.text
              }}</span>
              <span
                class="english fw-medium text-secondary h6 mb-0"
                v-if="item.english"
              >
                {{ item.english }}
              </span>
            </router-link>
          </div>

          <Transition name="expand">
            <ul
              v-if="item.subItems && activeSubMenu === item.text"
              class="sub-menu-list list-unstyled p-0"
            >
              <li v-for="sub in item.subItems" :key="sub.text">
                <router-link
                  :to="sub.link"
                  class="d-block py-3 text-secondary text-decoration-none fs-6"
                  @click="$emit('close')"
                >
                  {{ sub.text }}
                </router-link>
              </li>
            </ul>
          </Transition>
        </li>
      </ul>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from "vue";
defineProps(["show"]);
const emit = defineEmits(["close"]);

const activeSubMenu = ref(null);

// 漢堡選單內部的切換邏輯
const handleMouseEnter = (item) => {
  if (window.innerWidth >= 768) activeSubMenu.value = item.text;
};
const handleMouseLeave = () => {
  if (window.innerWidth >= 768) activeSubMenu.value = null;
};
const handleMobileClick = (item, event) => {
  // 僅針對手機端 (< 768px) 且有子選單的項目
  if (window.innerWidth < 768 && item.subItems) {
    // 如果目前這個子選單「還沒被打開」
    event.preventDefault(); // 🛑 攔截路由跳轉

    if (activeSubMenu.value === item.text) {
      activeSubMenu.value = null;
    } else {
      activeSubMenu.value = item.text;
    }
  }
};

const menuItems = [
  {
    text: "電影資訊",
    english: "Movie Information",
    link: "/movies",
    subItems: [
      { text: "現正熱映", link: "/movies/now-showing" },
      { text: "即將上映", link: "/movies/coming-soon" },
    ],
  },
  { text: "影城據點", english: "Theaters", link: "/theaters" },
  { text: "最新消息", english: "News", link: "/news" },
  { text: "團票 / 包廳", english: "Group Booking", link: "/group" },
  { text: "快速訂票", english: "Quick Booking", link: "/booking" },
];
</script>

<style scoped lang="scss">
.app-menu-overlay {
  position: fixed;
  // 💡 呼叫全域導航欄高度變數，確保手機/電腦自動對齊 [cite: 122]
  top: v.$web-top-padding-mobile;

  @include v.media-breakpoint-up(md) {
    top: v.$web-top-padding-pc;
  }

  left: 0;
  height: fit-content;
  background-color: v.$vieshow-dark; // [cite: 138]
  z-index: 1040;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none; // [cite: 126]
  }
}

.menu-item {
  // 💡 使用語意化邊框顏色變數 [cite: 161]
  border-color: v.$vieshow-secondary-emp !important;

  .chinese {
    // 💡 移除寫死數值，改用全域字距變數 (0.1em) [cite: 110]
    // 若需更寬字距 (0.3em) 則依指南保留為特殊 CSS 寫法 [cite: 127]
    letter-spacing: v.$letter-spacing-wide;
    margin-right: calc(v.$letter-spacing-wide * -1);
  }
}

.sub-menu-list {
  // 💡 背景透明度配合全域變數基準
  background-color: rgba(v.$black, 0.2);
}

/* 💡 從上而下絲滑展開效果 - 整合開發指南規範 [cite: 127] */
.slide-enter-active {
  transition:
    clip-path 0.5s cubic-bezier(0.23, 1, 0.32, 1),
    opacity 0.2s linear; // 稍微增加透明度過度，感官更流暢
}

.slide-leave-active {
  transition:
    clip-path 0.4s cubic-bezier(0.4, 0, 1, 1),
    opacity 0.1s linear;
}

.slide-enter-from,
.slide-leave-to {
  clip-path: inset(0 0 100% 0);
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  clip-path: inset(0 0 0 0);
  opacity: 1;
}

.app-menu-overlay {
  will-change: clip-path, opacity;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
