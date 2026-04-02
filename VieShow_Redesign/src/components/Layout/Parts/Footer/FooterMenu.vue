<template>
  <div class="footer-menu-wrapper w-100">
    <ul class="footer-main-list list-unstyled m-0 p-0">
      <li
        v-for="group in menuData"
        :key="group.title"
        class="footer-group-item border-bottom border-secondary-emphasis"
      >
        <div
          class="menu-header d-flex justify-content-between align-items-center py-4 clickable-header px-3"
          @click="toggleGroup(group.title)"
        >
          <span class="header-text fw-medium">{{ group.title }}</span>
          <i
            :class="[
              activeGroups.includes(group.title)
                ? 'fa-solid fa-angle-up'
                : 'fa-solid fa-angle-down',
              'icon-md',
            ]"
          ></i>
        </div>

        <Transition name="expand">
          <ul
            v-if="activeGroups.includes(group.title)"
            class="sub-menu-list list-unstyled pb-3 px-3"
          >
            <li v-for="link in group.links" :key="link" class="py-3 px-3">
              <router-link
                to="/"
                class="sub-link text-secondary text-decoration-none"
              >
                {{ link }}
              </router-link>
            </li>
          </ul>
        </Transition>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";

const menuData = [
  {
    title: "關於威秀",
    links: ["最新消息", "影城據點", "威秀商場", "餐飲與商品", "人才招募"],
  },
  {
    title: "訂票專區",
    links: [
      "快速訂票",
      "電影資訊",
      "票種/票價",
      "信用卡優惠",
      "訂票問題",
      "團票/包廳",
    ],
  },
  {
    title: "特殊影廳",
    links: [
      "TITAN SCREEN",
      "MUCROWN",
      "IMAX",
      "4DX",
      "GOLD CLASS",
      "LIVE直播節目",
      "VR演唱會",
      "AD口述影像",
    ],
  },
  {
    title: "會員專區",
    links: ["會員服務", "常見問題", "電子發票", "隱私權政策"],
  },
];

// 💡 支援多個選單同時展開或個別切換
const activeGroups = ref([]);

const toggleGroup = (title) => {
  const index = activeGroups.value.indexOf(title);
  if (index > -1) {
    activeGroups.value.splice(index, 1);
  } else {
    activeGroups.value.push(title);
  }
};
</script>

<style scoped lang="scss">
.footer-menu-wrapper {
  .footer-group-item {
    // 💡 使用語意化邊框顏色變數 [cite: 161, 164, 165]
    border-color: v.$vieshow-secondary-emp !important;
  }

  .clickable-header {
    .icon-md {
      color: rgba(v.$vieshow-tertiary, 0.6); // 使用更亮的淺灰色並帶點透明
      transition: all 0.3s ease;
    }
    .header-text {
      // 💡 呼叫 h5 變數：手機版自動為 20px，電腦版自動為 22px [cite: 11, 39, 143]
      font-size: var(--app-font-size-h5);

      color: v.$vieshow-secondary;
      font-weight: v.$font-weight-medium; // 500
      letter-spacing: v.$letter-spacing-wide; // 0.1em [cite: 17, 41]
      transition: color 0.3s ease;
    }

    // 💡 Hover 標題時變亮的視覺感
    @include v.hover-focus {
      filter: brightness(1.3);
      .header-text {
        color: v.$white;
      }
      .icon-md {
        color: v.$white !important; // Icon 變純白

        // 增加藍色微光發光質感 (Drop-Shadow 濾鏡)
        filter: drop-shadow(0 0 10px rgba(47, 150, 238, 0.7));

        // 可選：增加輕微上浮感，更有互動感
        transform: translateY(-2px);
      }
    }
  }

  .sub-menu-list {
    .sub-link {
      // 💡 子選項字體自動縮放：手機 14px / 電腦 16px
      font-size: var(--app-font-size-base);
      transition: color 0.2s;

      @include v.hover-focus {
        color: v.$vieshow-primary !important; // Hover 時變成威秀藍 [cite: 160]
      }
    }
  }
}

/* 💡 展開動畫對齊全站動態規範 [cite: 127] */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-out;
  max-height: 500px;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
