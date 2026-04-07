<template>
  <div class="footer-menu-wrapper w-100">
    <ul class="footer-main-list list-unstyled m-0 p-0 d-flex flex-column flex-lg-row justify-content-between">
      <li
        v-for="group in menuData"
        :key="group.title"
        class="footer-group-item border-bottom border-lg-none"
      >
        <div
          class="menu-header d-flex justify-content-between align-items-center py-4 py-lg-0 mb-lg-4 px-3 px-lg-0"
          @click="toggleGroup(group.title)"
        >
          <span class="header-text fw-medium text-white">{{ group.title }}</span>
          <i
            class="fa-solid d-lg-none"
            :class="[activeGroups.includes(group.title) ? 'fa-angle-up' : 'fa-angle-down']"
          ></i>
        </div>

        <Transition name="expand">
          <ul
            v-if="isDesktop || activeGroups.includes(group.title)"
            class="sub-menu-list list-unstyled pb-3 pb-lg-0 px-3 px-lg-0"
          >
            <li v-for="link in group.links" :key="link" class="py-2">
              <router-link to="/" class="sub-link text-decoration-none">
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
import { ref, onMounted, onUnmounted } from "vue";

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

const activeGroups = ref([]);
const isDesktop = ref(false);
// 更新視窗寬度判斷
const updateView = () => {
  isDesktop.value = window.innerWidth >= 1024;
};

const toggleGroup = (title) => {
  if (isDesktop.value) return;
  const index = activeGroups.value.indexOf(title);
  if (index > -1) activeGroups.value.splice(index, 1);
  else activeGroups.value.push(title);
};

onMounted(() => {
  updateView();
  window.addEventListener('resize', updateView);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateView);
});
</script>


<style scoped lang="scss">
.footer-menu-wrapper {
  .footer-group-item {
    border-color: v.$vieshow-secondary-emp !important;
    @include v.media-breakpoint-up(lg) {
      border-bottom: none !important;
    }
  }

  .header-text{
    font-size: var(--app-font-size-h6);
    color: v.$white;
  }

  .sub-link {
    font-size: var(--app-font-size-base);
    color: v.$vieshow-secondary;
    transition: color 0.3s ease;
    @include v.hover-focus {
      color: v.$vieshow-primary !important;
    }
  }
}

/* 動畫：確保手機版摺疊滑順  */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 400px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
