<script setup>
import SignUpStepHeader from './Parts/SignUpStepHeader.vue';
import { useRoute } from 'vue-router';
const route = useRoute(); // 取得當前的路由資訊
</script>

<template>
  <div class="default-layout ">
    <SignUpStepHeader />

    <main class="layout-main other-wrapper">
      <router-view />
    </main>

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