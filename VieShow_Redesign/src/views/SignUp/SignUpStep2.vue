<script setup>
import { ref, computed, watch } from 'vue'; 
import { useRouter } from 'vue-router'; 
import { useAuthStore } from '@/store/authStore'; 
import InputBox from '@/components/Common/InputBox/InputBox.vue';
import SecondaryButton from '@/components/Common/Button/SecondaryButton.vue';
import GoogleLoginBtn from '@/components/Common/Button/GoogleLoginBtn.vue';
import ProgressStep from '@/components/Common/ProgressStep.vue';

const router = useRouter();
const authStore = useAuthStore();

// ── 狀態變數 ──────────────────────────────────────────
const idNumber = ref(authStore.pendingUser.idNumber || ''); 
const currentStep = ref(2);
const totalSteps = 4;
const isVerified = ref(!!authStore.pendingUser.idNumber); 
const googleError = ref(''); // 錯誤訊息提示

// 防呆：改過 ID 就要重新驗證
watch(idNumber, (newVal) => {
  if (newVal !== authStore.pendingUser.idNumber) {
    isVerified.value = false;
    googleError.value = ''; // 號碼改了，錯誤訊息也先清掉
  }
});

const canVerify = computed(() => idNumber.value.trim().length > 0);

async function handleVerify() {
  if (!canVerify.value) return;
  isVerified.value = true;
}

// ── 共同清空邏輯 ──────────────────────────────────────
// 前往 Step 3 前，確保那邊的資料是乾淨的（符合需求：前進時下一頁要是空的）
function prepareNextStep() {
  authStore.pendingUser.idNumber = idNumber.value;
  authStore.pendingUser.realName = "";
  authStore.pendingUser.phone = "";
  authStore.pendingUser.birthday = null;
}

// ── 1. 帳號密碼註冊 ────────────────────────────────────
function handleRegisterAccount() {
  prepareNextStep();
  console.log("一般註冊：前往 Step 3");
  router.push('/SignUp/SignUpStep3'); 
}

// ── 2. 🌟 正式 Google 登入處理 ──────────────────────────
// 當 GoogleLoginBtn 成功登入並回傳資料時觸發
function handleGoogleLoginSuccess(googleResponse) {
  googleError.value = '';
  
  // 從 Google 回傳的資料中取得真實 Email (視你的元件回傳結構而定)
  const realEmail = googleResponse.email; 

  if (!realEmail) {
    googleError.value = '無法取得 Google 帳號資訊，請重試。';
    return;
  }

  // 執行前進準備（存 ID + 清空 Step 3）
  prepareNextStep();

  // 呼叫 Store 檢查此 Email 是否註冊過
  const result = authStore.startGoogleRegistration(realEmail);

  if (result.action === 'register') {
    // ✅ 情況 A：新用戶 -> 跳轉到 Step 3 補全電話姓名
    console.log(`Google 新用戶(${realEmail})，跳轉至 Step 3`);
    router.push('/SignUp/SignUpStep3');
  } else {
    // ❌ 情況 B：老用戶 -> 攔截，原地顯示紅字
    console.warn("偵測到重複註冊，攔截跳轉");
    googleError.value = '此 Google 信箱已被註冊，請直接登入或更換帳號。';
  }
}
</script>

<template>
  <ProgressStep :currentStep="currentStep" :totalSteps="totalSteps" />
  <form @submit.prevent class="container">
    <ul class="list-unstyled d-flex flex-column gap-4">
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
          <span class="d-block text-secondary">請注意：</span>
          <span class="text-secondary opacity-75">
            若您於申請會員時出現『此身份證號碼已存在』或『此信箱已加入過會員』的訊息而無法註冊，請洽各影城服務專線為您查詢處理。
          </span>
      </li>
    </ul>

    <section v-if="isVerified" class="animate-fade form-section list-unstyled d-flex flex-column gap-4 mt-4">
      <h5 class="section-title text-light mb-1 border-top border-secondary pt-4">選擇註冊方式</h5>
      <div class="section-btn d-flex flex-wrap gap-4">
        <SecondaryButton class="btn-primary-register" @click="handleRegisterAccount">
          帳號密碼註冊
        </SecondaryButton>
        <GoogleLoginBtn 
          class="btn-primary-register" 
          @success="handleGoogleLoginSuccess" 
        />
      </div>

      <div v-if="googleError" class="text-danger fs-7 animate-fade mt-1 ps-1">
        <i class="fa-solid fa-circle-exclamation me-1"></i>{{ googleError }}
      </div>
    </section>  
  </form>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.fs-7 { font-size: 0.85rem; }
.font-size-mini { font-size: var(--app-font-size-mini); }

.section-btn {
  justify-content: center;
  @include media-breakpoint-up(md) {
    justify-content: start;
  }
}

.btn-primary-register {
    width: 192.14px;
    height: 40px;
}

.animate-fade {
  animation: fadeIn 0.35s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>