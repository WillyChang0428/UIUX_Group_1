<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import MetadataInput from '@/components/Common/InputBox/MetadataInput.vue'
import SecondaryButton from '@/components/Common/Button/SecondaryButton.vue'
// import PrimaryButton from '@/components/Common/Button/PrimaryButton.vue'

const router = useRouter()

// ── 狀態變數 ──────────────────────────────────────────────
const userAccount  = ref('')
const userPassword = ref('')

// ── 計算屬性：帳號和密碼都有值才能送出 ────────────────────
const canSubmit = computed(() =>
  userAccount.value.trim().length > 0 &&
  userPassword.value.trim().length > 0
)

// ── 欄位驗證（blur 時觸發）────────────────────────────────
function validateCurrentFields() {
  // TODO: 加入欄位格式驗證邏輯
}

// ── 送出 ──────────────────────────────────────────────────
async function handleSubmit() {
  if (!canSubmit.value) return
  // TODO: 呼叫 API 建立帳號
  router.push({ name: 'RegisterSuccess' })
}

// ── 導航 ──────────────────────────────────────────────────
function handleBack()  { router.back() }
function handleClose() { router.push({ name: 'Home' }) }
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <ul class="container list-unstyled d-flex flex-column gap-4">

      <li><h5 class="text-light mb-1">帳號密碼設定</h5></li>

      <li>
        <MetadataInput
          label="帳號"
          placeholder="請輸入電子信箱"
          v-model="userAccount"
          @blur="validateCurrentFields"
        />
      </li>

      <li>
        <MetadataInput
          label="密碼"
          placeholder="英、數組合至少8個字元"
          v-model="userPassword"
          @blur="validateCurrentFields"
        />
      </li>

      <li class="notice-text text-light font-size-mini">
        <span class="d-block">請注意：</span>
        若您於申請會員時出現『此身份證號碼已存在』或『此信箱已加入過會員』的訊息而無法註冊，請洽各影城服務專線為您查詢處理。
      </li>

      <li class="d-flex justify-content-end">
        <SecondaryButton
          type="submit"
          class="flex-shrink-0 text-nowrap"
          :class="{ 'btn-disabled': !canSubmit }"
          :disabled="!canSubmit"
        >
          下一步
        </SecondaryButton>
      </li>

    </ul>
  </form>
</template>

<style lang="scss" scoped>
.font-size-mini {
  font-size: 12px;
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.animate-fade {
  animation: fadeIn 0.35s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>