<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 準備用來跳轉下一頁

import MetadataInput from '@/components/Common/InputBox/MetadataInput.vue';
import Calendar from '@/components/Common/InputBox/Calendar.vue';
import SecondaryButton from '@/components/Common/Button/SecondaryButton.vue';
// import PrimaryButton from '@/components/Common/Button/PrimaryButton.vue';

const router = useRouter();

// --- 1. 定義輸入資料 ---
const userName = ref('');
const myBirthday = ref(null);
const userPhone = ref('');
const verifyCode = ref('');

// --- 2. 全局錯誤狀態 ---
const showGlobalError = ref(false);
const isVerifying = ref(false);
const isCodeSent = ref(false);

// --- 3. 統整驗證邏輯 ---
// 這個函式會檢查「目前畫面上顯示的所有欄位」是否有空值
const validateCurrentFields = () => {
  let isValid = true;

  if (!userName.value) isValid = false;
  if (!myBirthday.value) isValid = false;
  if (!userPhone.value) isValid = false;
  // 如果驗證碼欄位已經出現了，才需要檢查它
  if (isCodeSent.value && !verifyCode.value) isValid = false;

  // 根據檢查結果決定是否顯示全局紅字
  showGlobalError.value = !isValid;
  return isValid;
};

// --- 4. 發送驗證碼邏輯 ---
const handleVerify = async () => {
  // 按下驗證前，先檢查當前欄位
  if (!validateCurrentFields()) return;
  
  isVerifying.value = true;
  console.log("正在發送驗證碼到:", userPhone.value);
  
  setTimeout(() => {
    isVerifying.value = false; 
    isCodeSent.value = true;
  }, 2000);
}

// --- 5. 註冊與下一步邏輯 ---
const handleRegister = () => {
  // 點擊下一步前，再次檢查所有欄位
  if (!validateCurrentFields()) return;

  console.log("資料填寫完整，準備前往下一步！");
  
  // 🌟 在這裡放入跳轉邏輯
  // router.push('/next-step-url'); 
}
</script>

<template>
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
      <li class="d-flex justify-content-end">
        <div v-if="showGlobalError" class="text-danger text-start fs-7 animate-fade mt-1 flex-grow-1">
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