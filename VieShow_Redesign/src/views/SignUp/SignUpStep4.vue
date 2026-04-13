<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore' // 🌟 引入 Store

import MetadataInput from '@/components/Common/InputBox/MetadataInput.vue'
import SecondaryButton from '@/components/Common/Button/SecondaryButton.vue'
import ProgressStep from '@/components/Common/ProgressStep.vue' // 🌟 引入進度條

const router = useRouter()
const authStore = useAuthStore()

// ── 狀態變數 ──────────────────────────────────────────────
// ✅ 需求 1：往回切時看到紀錄 (從 Store 讀取)
const userAccount = ref(authStore.pendingUser.email || '')
const userPassword = ref(authStore.pendingUser.password || '')
const userPasswordConfirm = ref('') // 確認密碼通常不記憶，安全性考量
const errorMessage = ref('')

const currentStep = ref(4)
const totalSteps = 4

// ── 計算屬性 ──────────────────────────────────────────────
const canSubmit = computed(() => {
  return (
    userAccount.value.trim().length > 0 &&
    userPassword.value.trim().length > 0 &&
    userPasswordConfirm.value.trim().length > 0
  )
})

// ── 送出邏輯 ──────────────────────────────────────────────
async function handleSubmit() {
  errorMessage.value = '';

  // 1. 判斷兩次密碼是否相符
  if (userPassword.value !== userPasswordConfirm.value) {
    errorMessage.value = '兩次輸入的密碼不相符，請再次確認';
    return;
  }

  // 🎯 2. 將最後資料存入 Store
  authStore.pendingUser.email = userAccount.value;
  authStore.pendingUser.password = userPassword.value;

  console.log("驗證通過，正式建立帳號！");

  // 🎯 3. 呼叫 Store 裡的「註冊完成」Action (將暫存推入 userList)
  authStore.completeRegistration();

  // 4. 跳轉至成功頁 (Step 5)
  router.push('/SignUp/SignUpStep5'); 
}
</script>

<template>
  <div class="container py-5">
  <ProgressStep :currentStep="currentStep" :totalSteps="totalSteps" />
  
  <form @submit.prevent="handleSubmit">
    <ul class="list-unstyled d-flex flex-column gap-4 pt-3">
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
        <span class="d-block text-secondary">請注意：</span>
        <span class="text-secondary opacity-75">
          若您於申請會員時出現『此身份證號碼已存在』或『此信箱已加入過會員』的訊息而無法註冊，請洽各影城服務專線為您查詢處理。
        </span>
      </li>

      <li class="d-flex justify-content-end mt-2">
        <SecondaryButton
          type="submit"
          class="flex-shrink-0 text-nowrap px-5"
          :disabled="!canSubmit"
        >
          完成註冊
        </SecondaryButton>
      </li>
    </ul>
  </form>
  </div>
</template>

<style lang="scss" scoped>
.fs-7 { font-size: 0.85rem; }
.font-size-mini { font-size: 12px; }
.animate-fade {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>