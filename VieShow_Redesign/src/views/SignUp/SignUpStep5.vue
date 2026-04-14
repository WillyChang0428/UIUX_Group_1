<template>
  <div class="page-register">
    <main class="page-content d-flex justify-content-center align-items-center">
      <div class="success-center d-grid gap-3 d-flex flex-column align-items-center">
        <div class="check-icon text-light d-flex justify-content-center align-items-center">
          <i class="fa-regular fa-circle-check"></i>
        </div>
        <h5 class="success-text text-white lh-relaxed">註冊成功</h5>
      </div>
    </main>

    <footer class="page-footer d-flex justify-content-center align-items-center">
      <PrimaryButton
        class="btn-complete d-flex justify-content-center align-items-center w-100"
        @click="handleComplete"
      >
        完成
      </PrimaryButton>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import PrimaryButton from "@/components/Common/Button/PrimaryButton.vue";

const router = useRouter();

function handleComplete() {

  router.push("/booking/paying"); 
}
</script>

<style lang="scss" scoped>
/* 樣式保持不變 */
.page-content {
  min-height: 100vh;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 200px;
}

.check-icon { font-size: 80px; }

.page-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: v.$spacing-md-mobile v.$container-padding-mobile v.$spacing-xl-mobile;
  background: transparent;
}

@media (min-width: 768px) {
  .page-content { padding-top: v.$web-top-padding-pc; }
  .page-footer {
    padding-left: v.$container-padding-pc;
    padding-right: v.$container-padding-pc;
    padding-bottom: v.$spacing-2xl-pc;
  }
  .btn-complete {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>