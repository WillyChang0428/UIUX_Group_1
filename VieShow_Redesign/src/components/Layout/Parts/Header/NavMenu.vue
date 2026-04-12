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
              <span class="chinese fw-medium h2 mb-2 ls-wide">{{
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
  // 💡 如果是在手機版，且該項目「有」子選單，就攔截跳轉並展開子選單
  if (window.innerWidth < 768 && item.subItems) {
    event.preventDefault(); 

    if (activeSubMenu.value === item.text) {
      activeSubMenu.value = null;
    } else {
      activeSubMenu.value = item.text;
    }
  } else {
    // 💡 關鍵修正：如果「沒有」子選單（也就是可以直接跳轉的連結），
    // 或是目前在電腦版，就發送 close 事件給父元件，把選單關起來！
    emit('close');
  }
};

const menuItems = [
  { text: "電影資訊", english: "Movie Information", link: "/movieinfo" },
  { text: "影城據點", english: "Theaters", link: "/" },
  { text: "最新消息", english: "News", link: "/" },
  { text: "團票 / 包廳", english: "Group Booking", link: "/" },
  { text: "快速訂票", english: "Quick Booking", link: "/fastbooking" },
];
</script>

<style scoped lang="scss">
/* 💡 統一使用 @import 載入變數，下方全面拔除 v. 前綴 */
@import "@/assets/scss/variables";

.app-menu-overlay {
  position: fixed;
  top: $web-top-padding-mobile;
  left: 0;
  height: fit-content;
  background-color: $vieshow-dark; 
  z-index: 1100;
  overflow-y: auto;

  @include media-breakpoint-up(md) {
    top: $web-top-padding-pc;
  }
  
  // 💡 在大螢幕 (lg 以上) 通常會顯示完整導覽列，所以隱藏漢堡選單
  @include media-breakpoint-up(lg) {
    display: none !important;
  }

  &::-webkit-scrollbar {
    display: none; 
  }
}

.menu-item {
  border-color: $vieshow-secondary-emp !important;

  .chinese {
    letter-spacing: $letter-spacing-wide;
    margin-right: calc(#{$letter-spacing-wide} * -1);
  }
}

.sub-menu-list {
  background-color: rgba($black, 0.2);
}

/* 💡 從上而下絲滑展開效果 */
.slide-enter-active {
  transition:
    clip-path 0.5s cubic-bezier(0.23, 1, 0.32, 1),
    opacity 0.2s linear; 
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