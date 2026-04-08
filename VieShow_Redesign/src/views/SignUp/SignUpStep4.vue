<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import MetadataInput from '@/components/Common/InputBox/MetadataInput.vue'
import SecondaryButton from '@/components/Common/Button/SecondaryButton.vue'

const router = useRouter()

// ── 狀態變數 ──────────────────────────────────────────────
const userAccount = ref('')
const userPassword = ref('')
const userPasswordConfirm = ref('')
const errorMessage = ref('') // 🌟 用來儲存錯誤訊息的變數

// ── 計算屬性：只要欄位「都有填」按鈕就亮起 ────────────────────
const canSubmit = computed(() => {
  return (
    userAccount.value.trim().length > 0 &&
    userPassword.value.trim().length > 0 &&
    userPasswordConfirm.value.trim().length > 0
  )
})

// ── 送出邏輯（核心修改點） ────────────────────────────────────
async function handleSubmit() {
  // 1. 先清空先前的錯誤訊息
  errorMessage.value = '';

  // 2. 判斷兩次密碼是否相符
  if (userPassword.value !== userPasswordConfirm.value) {
    // 🌟 不相符：更新訊息，並中斷執行（不跳轉）
    errorMessage.value = '兩次輸入的密碼不相符，請再次確認';
    return;
  }

  // 3. 相符：呼叫 API 並跳轉
  console.log("驗證通過，準備建立帳號！");
  // await api.register(...)
  router.push({ name: 'RegisterSuccess' });
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <ul class="container list-unstyled d-flex flex-column gap-4">

      <li><h5 class="text-light mb-1">帳號密碼設定</h5></li>

      <li>
        <MetadataInput
          label="帳　　號"
          placeholder="請輸入電子信箱"
          v-model="userAccount"
        />
      </li>

      <li>
        <MetadataInput
          label="密　　碼"
          type="password"
          placeholder="英、數組合至少8個字元"
          v-model="userPassword"
        />
      </li>

      <li>
        <MetadataInput
          label="密碼確認"
          type="password"
          placeholder="請再次輸入密碼"
          v-model="userPasswordConfirm"
        />
      </li>

      <li v-if="errorMessage" class="animate-fade text-danger fs-7 ps-2">
        <i class="fa-solid fa-circle-exclamation me-1"></i>{{ errorMessage }}
      </li>

      <li class="notice-text text-light font-size-mini">
        <span class="d-block">請注意：</span>
        若您於申請會員時出現『此身份證號碼已存在』或『此信箱已加入過會員』的訊息而無法註冊，請洽各影城服務專線為您查詢處理。
      </li>

      <li class="d-flex justify-content-end mt-2">
        <SecondaryButton
          type="submit"
          class="flex-shrink-0 text-nowrap px-5"
          :disabled="!canSubmit"
        >
          下一步
        </SecondaryButton>
      </li>

    </ul>
  </form>
</template>

<style lang="scss" scoped>
.fs-7 {
  font-size: 0.85rem;
}
.font-size-mini {
  font-size: 12px;
  opacity: 0.8;
}

// 讓錯誤訊息跳出來時有個小動畫
.animate-fade {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>