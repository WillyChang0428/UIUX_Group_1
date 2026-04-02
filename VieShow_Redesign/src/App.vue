<script setup>
import SelectBox from "@/components/Common/Selecter/SelectBox.vue";
import Header from "@/components/Layout/Parts/Header.vue";
import SecondaryButton from "@/components/Common/Button/SecondaryButton.vue";
import PrimaryButton from "@/components/Common/Button/PrimaryButton.vue";
import MiniButton from "@/components/Common/Button/MiniButton.vue";
</script>

<template>
  <Header />
  <MiniButton>立即訂票</MiniButton>

  <MiniButton status="warning">取消訂單</MiniButton>

  <MiniButton status="unable" is-disabled>尚未開放</MiniButton>

  <MiniButton status="secondary">返回列表</MiniButton>
</template>

<style lang="scss">
body {
  height: 100vh;
  background: v.$vieshow-gradient-dark;
  padding: 133px 0 0;
  /* 預留 Header 的高度 */
}
</style>
