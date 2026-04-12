<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import SignUpStart from '@/components/Auth/SignUpStart.vue';
import Agreement from '@/components/Auth/Agreement.vue';
import SecondaryButton from '@/components/Common/Button/SecondaryButton.vue';
import ProgressStep from '@/components/Common/ProgressStep.vue';
// 🌟 1. 引入你的 BaseModal (請確認路徑是否正確)
import BaseModal from '@/components/Common/Button/BaseModal.vue';

const router = useRouter();
const isAgreed = ref(false);
const currentStep = ref(1);
const totalSteps = 4;
const authStore = useAuthStore();

// 🌟 2. 控制條款彈窗開關的變數
const isTermsModalOpen = ref(false);

const handleNext = () => {
  if (!isAgreed.value) return; 
  authStore.resetPendingUser();
  console.log("同意條款，準備前往下一步！");
  router.push('/SignUp/SignUpStep2'); 
};
</script>

<template>
  <ProgressStep :currentStep="currentStep" :totalSteps="totalSteps" />
  <div class="container d-flex flex-column justify-content-center align-items-center gap-3 ">
    <img src="@/assets/images/Member1.png" class="d-none d-md-block rounded">
    <img src="@/assets/images/Member2.png" class="d-md-none rounded">
    
    <div class="outer-wrapper border border-light rounded p-3 w-100">
      <div class="inner-scroll-box">
        <SignUpStart></SignUpStart>
      </div>
    </div>
    
    <div class="w-100 d-flex flex-column gap-3 mt-1">
        
        <label class="custom-checkbox d-flex align-items-center gap-2 m-0 px-1">
          <input type="checkbox" v-model="isAgreed" class="d-none" />
          
          <div class="checkbox-box d-flex justify-content-center align-items-center rounded">
            <i class="fa-solid fa-check check-icon" :class="{ 'is-active': isAgreed }"></i>
          </div>
          
          <span class="text-light select-none">
            我同意
            <span class="terms-link" @click.prevent="isTermsModalOpen = true">威秀影城會員服務辦法</span>
          </span>
          
        </label>
        <SecondaryButton 
          class="w-100 py-2 my-3"
          :disabled="!isAgreed" 
          @click="handleNext"
        >
          下一步
        </SecondaryButton>
      </div>

      <BaseModal v-model="isTermsModalOpen" type="scroll">
        <template #title>【威秀影城iShow會員】服務辦法：</template>
        <template #content>
          <Agreement />
        </template>
      </BaseModal>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

html, body , #app {
  height: 100vh;
  background: v.$vieshow-gradient-dark;
}

img {
  max-width: 100%;
  height: auto;
}

/* --- 外層容器：只管背景和白線邊框 --- */
.outer-wrapper {
  background: rgba(v.$black, 0.3);
  border-color: rgba(v.$light, 0.2) !important;
}

/* --- 內層容器：負責高度與所有捲軸行為 --- */
.inner-scroll-box {
  height: 30vh; 
  overflow-y: auto; 
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(v.$light, 0.3);
    border-radius: 10px;
    
    &:hover {
      background-color: rgba(v.$light, 0.5);
    }
  }
}

.custom-checkbox {
  cursor: pointer;
  user-select: none; 
  
  .checkbox-box {
    width: 22px;
    height: 22px;
    border: 2px solid rgba(v.$light, 0.5);
    transition: all 0.2s ease;
    
    .check-icon {
      color: v.$vieshow-dark; 
      font-size: 14px;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      
      &.is-active {
        opacity: 1;
        transform: scale(1); 
      }
    }
  }

  input:checked + .checkbox-box {
    background-color: v.$vieshow-primary;
    border-color: v.$vieshow-primary;
  }
}

/* 🌟 5. 新增條款文字的樣式 */
.terms-link {
  color: v.$vieshow-primary;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0 4px; // 稍微增加點擊熱區

  &:hover {
    color: v.$vieshow-primary-dark;
  }
}
</style>