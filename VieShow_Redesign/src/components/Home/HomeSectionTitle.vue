<!-- 使用方式 
<HomeSectionTitle title="LIVE演唱會" link="/live" />
-->

<template>
  <div class="home-section-title mb-6 mt-7">
    <router-link
      :to="link"
      class="title-link d-inline-flex align-items-center text-white"
    >
      <h2 class="h2 fw-bold mb-0">{{ title }}</h2>
      <i class="fa-solid fa-chevron-right ms-3 icon-sm"></i>
    </router-link>
  </div>
</template>

<script setup>
// 定義 props 讓標題與連結可隨時替換
defineProps({
  title: {
    type: String,
    required: true,
    default: "標題名稱",
  },
  link: {
    type: String,
    required: true,
    default: "/",
  },
});
</script>

<style scoped lang="scss">
/* 引入地基變數，以便調用 v.$ 語法 */
@import "@/assets/scss/variables";

.home-section-title {
  .title-link {
    transition: color 0.3s ease;
    cursor: pointer;
    text-decoration: none; // 覆蓋全域 a:hover 底線 [cite: 1]

    /* 設定 H2 字體大小，隨螢幕自動縮放 (32px / 34px)  */
    .h2 {
      font-size: var(--app-font-size-h2);
      line-height: var(--lh-h2); // 使用響應式行高 [cite: 152]
    }

    /* 設定箭頭樣式與初始動畫狀態 */
    i {
      transition: transform 0.3s ease;
      /* 使用響應式圖示尺寸變數 (16px / 32px) [cite: 156] */
      font-size: var(--icon-sm);
    }

    /* 💡 Hover 互動效果：顏色變品牌藍，箭頭位移 */
    &:hover {
      color: v.$vieshow-primary !important; // 變更顏色為品牌藍 [cite: 160]

      i {
        /* 箭頭向右位移 8px */
        transform: translateX(8px);
      }
    }
  }
}
</style>
