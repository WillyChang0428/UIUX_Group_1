<script setup>
import Header from './Parts/Header/Header.vue';
import Footer from './Parts/Footer/Footer.vue';

</script>
<template>
  <div class="default-layout ">
    <Header />

    <main class="layout-main main-wrapper">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<style lang="scss" scoped>
/* 💡 引入全域變數，並移除原本會報錯的 v. 前綴 */
@import "@/assets/scss/variables";

.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; // 確保佈局至少跟螢幕一樣高
  background: $vieshow-gradient-dark; // 💡 使用正確的變數呼叫方式
}

.layout-main {
  flex: 1; // 讓中間內容區自動撐開，把 Footer 推到底部
}
</style>