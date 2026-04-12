<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 
import { useAuthStore } from '@/store/authStore'; // 🌟 引入 Store

import MetadataInput from '@/components/Common/InputBox/MetadataInput.vue';
import Calendar from '@/components/Common/InputBox/Calendar.vue';
import SecondaryButton from '@/components/Common/Button/SecondaryButton.vue';
import ProgressStep from '@/components/Common/ProgressStep.vue'; // 🌟 引入進度條

const router = useRouter();
const authStore = useAuthStore();

// --- 1. 定義輸入資料 (🌟 改為優先讀取 Store) ---
const userName   = ref(authStore.pendingUser.realName || '');
const myBirthday = ref(authStore.pendingUser.birthday || null); // 假設 Store 有 birthday 欄位
const userPhone  = ref(authStore.pendingUser.phone || '');
const verifyCode = ref('');

const currentStep = ref(3);
const totalSteps = 4;

// --- 2. 全局狀態 ---
const showGlobalError = ref(false);
const isVerifying = ref(false);
const isCodeSent = ref(false);

// --- 3. 統整驗證邏輯 ---
const validateCurrentFields = () => {
  let isValid = true;
  if (!userName.value) isValid = false;
  if (!myBirthday.value) isValid = false;
  if (!userPhone.value) isValid = false;
  if (isCodeSent.value && !verifyCode.value) isValid = false;

  showGlobalError.value = !isValid;
  return isValid;
};

// --- 4. 發送驗證碼邏輯 ---
const handleVerify = async () => {
  if (!validateCurrentFields()) return;
  
  isVerifying.value = true;
  console.log("正在發送驗證碼到:", userPhone.value);
  
  // 模擬 API 呼叫
  setTimeout(() => {
    isVerifying.value = false; 
    isCodeSent.value = true;
  }, 2000);
}

// --- 5. 註冊與下一步邏輯 ---
const handleRegister = () => {
  // 1. 驗證擋箭牌
  if (!validateCurrentFields()) return;

  // 🎯 存入本頁資料（為了讓使用者「按回上一頁」時能看到紀錄）
  authStore.pendingUser.realName = userName.value;
  authStore.pendingUser.phone = userPhone.value;
  authStore.pendingUser.birthday = myBirthday.value;

  // 🌟 分流邏輯
  if (authStore.pendingUser.isGoogleLinked) {
    // A. Google 註冊者：免設帳密，直接原地結帳
    console.log("偵測到 Google 帳號，跳過 Step 4");
    
    authStore.completeRegistration();   // 把資料推入 userList 並清空暫存
    router.push('/SignUp/SignUpStep5'); // 飛往成功頁
    
  } else {
    // B. 一般註冊者：要去 Step 4 設帳密
    // ✅ 往下一步前，確保 Step 4 的欄位是空的
    authStore.pendingUser.email = "";
    authStore.pendingUser.password = "";
    
    console.log("一般註冊，前往 Step 4 設定帳密");
    router.push('/SignUp/SignUpStep4');
  } 
}
</script>

<template>
  <ProgressStep :currentStep="currentStep" :totalSteps="totalSteps" />

  <form @submit.prevent="handleRegister">
    <ul class="container list-unstyled d-flex flex-column gap-4">
      <li><h5 class="text-light mb-1">填寫會員資料</h5></li>
      <li>
        <MetadataInput
          label="您的姓名"
          placeholder="請輸入文字"
          v-model="userName"
          @blur="validateCurrentFields"
        />
      </li>
      <li>
        <Calendar 
          v-model="myBirthday" 
          @focusout="validateCurrentFields"
        />
      </li>
      <li>
        <div class="d-flex gap-3 w-100">
          <div class="flex-grow-1" style="min-width: 0;">
            <MetadataInput
              label="手機號碼"
              placeholder="請輸入號碼"
              type="tel"
              inputmode="numeric"
              v-model="userPhone"
              @blur="validateCurrentFields"
            />
          </div>
          <div class="d-flex justify-content-end">
            <SecondaryButton 
              type="button"
              @click="handleVerify" 
              :is-disabled="isVerifying"
              :status="isVerifying ? 'secondary' : 'default'"
              class="flex-shrink-0 text-nowrap"
              style="height: 48px; min-width: 90px;"
            >
              {{ isVerifying ? '傳送中' : '傳送' }}
            </SecondaryButton>
          </div>
        </div>
      </li>

      <li v-if="isCodeSent" class="animate-fade">
        <MetadataInput 
          label="驗證碼" 
          placeholder="請輸入簡訊驗證碼" 
          v-model="verifyCode"
          @blur="validateCurrentFields"
        />
      </li>

      <li class="d-flex justify-content-end align-items-center">
        <div v-if="showGlobalError" class="text-danger text-start fs-7 animate-fade flex-grow-1">
          <i class="fa-solid fa-circle-exclamation me-1"></i>有欄位尚未填寫
        </div>

        <div v-if="isCodeSent" class="d-flex justify-content-end">
          <SecondaryButton type="submit" class="px-5 py-2">
            下一步
          </SecondaryButton>
        </div>
      </li>
    </ul>
  </form>
</template>

<style lang="scss" scoped>
.fs-7 {
  font-size: 0.85rem;
}
.animate-fade {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>