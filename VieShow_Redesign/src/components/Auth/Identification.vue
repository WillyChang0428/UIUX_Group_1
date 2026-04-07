<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // 準備用來跳轉下一頁

import InputBox from '@/components/Common/InputBox/InputBox.vue';
import SecondaryButton from '@/components/Common/Button/SecondaryButton.vue';
import PrimaryButton from '@/components/Common/Button/PrimaryButton.vue';

const router = useRouter();

// ── 狀態變數 ──────────────────────────────────────────
const idNumber   = ref('')       // 身分證輸入值
const isVerified = ref(false)    // 是否已驗證成功

// ── 計算屬性：按鈕是否可點擊 ──────────────────────────
// 有輸入內容才能按驗證（對應 註冊_2 → 註冊_3 的切換）
const canVerify = computed(() => idNumber.value.trim().length > 0)

// ── 驗證按鈕點擊 ──────────────────────────────────────
async function handleVerify() {
  if (!canVerify.value) return

  // TODO: 替換成真實 API 呼叫
  // const res = await api.verifyId(idNumber.value)
  // if (res.success) isVerified.value = true

  // 模擬驗證成功（測試用）
  isVerified.value = true
}

// ── 導航 ──────────────────────────────────────────────
function handleBack()  { router.back() }
function handleClose() { router.push({ name: 'Home' }) }

function handleRegister(type) {
  if (type === 'account') router.push({ name: 'RegisterAccount' })
  if (type === 'google')  { /* TODO: Google OAuth */ }
}
</script>

<template>
  <form @submit.prevent="handleRegister">
    <ul class="container list-unstyled d-flex flex-column gap-4">
      <li><h5 class="text-light mb-1">身分驗證</h5></li>
      <li>
        <div class="d-flex gap-3 w-100">
          <div class="flex-grow-1" style="min-width: 0;">
            <InputBox
              v-model="idNumber"
            type="text"
            class="id-input"
            placeholder="輸入您的身份證或居留證號碼"
            :disabled="isVerified"
            />
            <!-- 
            註冊_2：idNumber 空白 → 按鈕灰色 disabled
            註冊_3：有輸入    → 按鈕藍色 可點擊
            註冊_4：驗證成功  → 按鈕顯示「成功」灰底 disabled
          -->
          </div>
          <div class="d-flex justify-content-end">
            <SecondaryButton 
              class="flex-shrink-0 text-nowrap"
            :class="{
              'btn-verify--disabled': !canVerify && !isVerified,
              'btn-verify--done':     isVerified
            }"
            :disabled="!canVerify || isVerified"
            @click="handleVerify">
            {{ isVerified ? '成功' : '驗證' }}
            </SecondaryButton>
        </div>
        </div>
        </li>
      <li class="notice-text text-light font-size-mini">
          <span class="d-block">請注意：</span>
          若您於申請會員時出現『此身份證號碼已存在』或『此信箱已加入過會員』的訊息而無法註冊，請洽各影城服務專線為您查詢處理。
        </li>
        
    </ul>
    <!--  選擇註冊方式（驗證成功後才顯示，帶入場動畫） -->
        <section v-if="isVerified" class="animate-fade form-section container list-unstyled d-flex flex-column gap-4 mt-4">
          <h5 class="section-title text-light mb-1">選擇註冊方式</h5>
          <div class="btn-group-register d-flex gap-3">
            <PrimaryButton class="btn-primary-register" @click="handleRegister('account')">
              帳號密碼註冊
            </PrimaryButton>
            <PrimaryButton class="btn-primary-register" @click="handleRegister('google')">
              google帳號註冊
            </PrimaryButton>
          </div>
        </section>  
  </form>
</template>

<style lang="scss" scoped>
.fs-7 {
  font-size: 0.85rem;
}

.font-size-mini {
    font-size: var(--app-font-size-mini);
}

.btn-primary-register {
    width: 163px;
    height: 48px;
    gap: 24px;

}

.animate-fade {
  animation: fadeIn 0.35s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

</style>
