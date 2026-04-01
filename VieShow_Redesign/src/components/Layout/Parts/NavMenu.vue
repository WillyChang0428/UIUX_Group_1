<template>
  <Transition name="slide">
    <div v-if="show" class="app-menu-overlay">
      <ul class="menu-list">
        <li
          v-for="item in menuItems"
          :key="item.text"
          class="menu-item"
          @mouseenter="handleMouseEnter(item)"
          @mouseleave="handleMouseLeave"
        >
          <div class="main-link-container">
            <router-link
              :to="item.link"
              class="main-link"
              @click="handleMobileClick(item, $event)"
            >
              <span class="chinese display-5 lh-relaxed">{{ item.text }}</span>
              <span class="english" v-if="item.english">{{
                item.english
              }}</span>
            </router-link>
          </div>

          <Transition name="expand">
            <ul
              v-if="item.subItems && activeSubMenu === item.text"
              class="sub-menu-list"
            >
              <li v-for="sub in item.subItems" :key="sub.text">
                <router-link :to="sub.link" @click="$emit('close')">
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
  top: 134px; // 符合你 Mobile 的 WebTopPadding [cite: 210]
  left: 0;
  width: 100%;
  height: fit-content;
  background-color: v.$dark; // 使用你定義的黑色
  z-index: 1040;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: center;

  .menu-item {
    border-bottom: 1px solid v.$vieshow-secondary-emp;

    .main-link-container {
      width: 100%;
      cursor: pointer;
    }

    .main-link {
      display: flex;
      flex-direction: column;
      padding: v.$spacer * 1.5 0;
      text-decoration: none;
      color: white;

      .chinese {
        position: relative;
        font-weight: 600;
        letter-spacing: 0.3em;
        margin-right: -0.3em;
      }
      .english {
        color: v.$vieshow-secondary;
        letter-spacing: 0.2em;
        margin-right: -0.2em;
      }
    }
  }
}

.sub-menu-list {
  background-color: rgba(black, 0.2);
  list-style: none;
  padding: 0;
  li a {
    display: block;
    padding: v.$spacer 0;
    color: v.$vieshow-secondary;
    font-size: v.$font-size-base;
    text-decoration: none;
  }
}

// 動態過渡
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
