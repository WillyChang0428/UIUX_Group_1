<template>
  <div class="page-register">

    <!-- ── 主內容區：圖示 + 文字，垂直置中 ── -->
    <main class="page-content d-flex justify-content-center align-items-center">
      <div class="success-center d-grid gap-3 d-flex flex-column align-items-center">
        <div class="check-icon text-light d-flex justify-content-center align-items-center">
          <i class="fa-regular fa-circle-check"></i>
        </div>
        <h5 class="success-text text-white lh-relaxed">註冊成功</h5>
      </div>
    </main>

    <!-- ── 底部完成按鈕（固定底部） ── -->
    <footer class="page-footer d-flex justify-content-center align-items-center">
      <PrimaryButton class="btn-complete d-flex justify-content-center align-items-center w-100" @click="handleComplete">
        完成
      </PrimaryButton>
    </footer>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import PrimaryButton from '@/components/Common/Button/PrimaryButton.vue';

const router = useRouter()
function handleComplete() { router.push('/') }
</script>

<style lang="scss" scoped>
// ── 主內容區 ──────────────────────────────────────────────
.page-content {
  padding-top: v.$web-top-padding-mobile;
  padding-bottom: 100px;   // 讓出底部按鈕的空間
}

.check-icon {
  font-size: 80px;
}

// ── 底部完成按鈕 ──────────────────────────────────────────
.page-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: v.$spacing-md-mobile v.$container-padding-mobile v.$spacing-xl-mobile;
  background: transparent;
}

// ── 桌機 RWD ──────────────────────────────────────────────
@media (min-width: 768px) {
  .page-content {
    padding-top: v.$web-top-padding-pc;
  }

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