<script setup>
import Header from './Header.vue';
import Footer from './Footer.vue';

</script>
<template>
  <div class="default-layout">
    <Header />

    <main class="layout-main">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; // 確保佈局至少跟螢幕一樣高
}

.layout-main {
  flex: 1; // 讓中間內容區自動撐開，把 Footer 推到底部
  padding-top: 80px; // 假設 Header 高度是 80px，防止內容被遮住
}
</style>