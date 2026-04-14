<template>
  <BaseModal v-model="isOpen" type="base" @close="handleClose">
    <template #title>登入</template>

    <template #content>
      <div class="login-form-wrapper">
        <div class="input-group position-relative mb-4">
          <input
            type="email"
            class="form-control custom-input"
            placeholder="帳號"
            v-model="email"
            @keyup.enter="handleLogin"
          />
        </div>

        <div class="input-group position-relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            class="form-control custom-input"
            placeholder="密碼"
            v-model="password"
            @keyup.enter="handleLogin"
          />
          <span class="password-toggle" @click="showPassword = !showPassword">
            <i :class="['fa-regular', showPassword ? 'fa-eye' : 'fa-eye-slash']"></i>
          </span>
        </div>

        <div class="error-text text-danger mt-1">
          <span v-if="errorMessage">
            <i class="fa-solid fa-circle-exclamation me-1"></i>{{ errorMessage }}
          </span>
        </div>

        <div class="d-flex justify-content-end mb-3">
          <a href="#" class="text-secondary text-decoration-none forgot-pwd-link">忘記密碼？</a>
        </div>

        <div
          class="recaptcha-box d-flex justify-content-between align-items-center mb-4 mb-lg-3 gap-2"
          @click="isRobotChecked = !isRobotChecked"
        >
          <div class="d-flex align-items-center gap-3 gap-md-2">
            <i class="fa-solid fa-check text-success fs-4" v-if="isRobotChecked"></i>
            <div class="check-box" v-else></div>
            <span class="robot-text text-white">我不是機器人</span>
          </div>
          <div class="recaptcha-logo d-flex flex-column align-items-center">
            <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" width="28" />
            <span class="text-tertiary mt-1 recaptcha-terms">Privacy - Terms</span>
          </div>
        </div>

        <SecondaryButton class="w-100 fw-bold mb-3 mb-lg-2 login-btn" @click="handleLogin">
          登入
        </SecondaryButton>

        <GoogleLogin :callback="handleGoogleLogin" class="google-btn w-100 mb-3" />

        <div class="text-center text-secondary register-hint">
          還不是會員？
          <router-link
            to="/SignUp"
            @click="isOpen = false"
            class="register-link text-decoration-none fw-medium"
          >
            立即註冊
          </router-link>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { jwtDecode } from "jwt-decode";
import { watch } from 'vue';
import BaseModal from "@/components/Common/Button/BaseModal.vue";
import SecondaryButton from "@/components/Common/Button/SecondaryButton.vue";

const router = useRouter(); 
const authStore = useAuthStore();
const emit = defineEmits(["success"]);

const isOpen = defineModel({ type: Boolean, default: false });
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isRobotChecked = ref(false);
const errorMessage = ref("");

watch(() => authStore.isLoggedIn, (newVal) => {
  if (newVal === true) {
    console.log("偵測到已登入，自動關閉彈窗並通知成功！");
    isOpen.value = false; 
    emit("success");      
  }
});

const handleLogin = () => {
  errorMessage.value = "";
  if (!email.value || !password.value) {
    errorMessage.value = "請輸入帳號與密碼";
    return;
  }
  if (!isRobotChecked.value) {
    errorMessage.value = "請勾選「我不是機器人」進行驗證";
    return;
  }

  const isSuccess = authStore.login(email.value.trim(), password.value.trim());

  if (isSuccess) {
    isOpen.value = false;
    emit("success"); 
  } else {
    errorMessage.value = "帳號或密碼錯誤，請重新輸入";
  }
};

const handleGoogleLogin = (response) => {
  console.log("🚩 [Debug] 收到 Google 回傳：", response);
  
  try {
    if (!response.credential) {
      errorMessage.value = "Google 認證失敗，請重試。";
      return;
    }
    
    const decoded = jwtDecode(response.credential);
    const googleEmail = decoded.email;
    console.log("🚩 [Debug] 解析 Email：", googleEmail);

    if (!googleEmail) {
      errorMessage.value = "無法取得 Google 帳號資訊";
      return;
    }

    const result = authStore.startGoogleRegistration(googleEmail);
    console.log("🚩 [Debug] Store 分流結果：", result.action);

    if (result.action === 'login') {
      isOpen.value = false; 
      emit("success"); 
      console.log("✅ 老會員登入成功");
    } 
    else if (result.action === 'register') {
      console.log("🆕 新用戶，準備引導至註冊 Step 1");
      isOpen.value = false; 

      // 🌟 移除開新分頁 (window.open) 的邏輯
      // 直接使用 router.push 導向註冊頁面，留在當前分頁
      router.push('/SignUp/SignUpStep1');
    }
  } catch (error) {
    console.error("❌ Google 登入解析錯誤:", error);
    errorMessage.value = "系統忙碌中，請稍後再試";
  }
};

const handleClose = () => {
  isOpen.value = false;
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

/* CSS 樣式完全保持原樣，沒有更動 */
.login-form-wrapper {
  padding: 0;

  .custom-input {
    background: transparent !important;
    border: none;
    border-bottom: 1px solid rgba(v.$white, 0.3);
    border-radius: 0;
    color: v.$white;
    padding: var(--gap-sm) var(--gap-sm) var(--gap-sm) 0;
    font-size: var(--app-font-size-base);
    transition: all 0.3s ease;
    box-shadow: none !important;

    &:focus {
      border-bottom-color: v.$vieshow-primary;
    }

    &::placeholder {
      color: rgba(v.$white, 0.5);
    }

    &:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
      -webkit-text-fill-color: v.$white !important;
      transition: background-color 5000s ease-in-out 0s;
    }
  }

  .password-toggle {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: rgba(v.$white, 0.5);
    z-index: 10;
    padding: var(--gap-sm); 

    &:hover {
      color: v.$white;
    }
  }

  .error-text {
    font-size: var(--app-font-size-mini); 
    letter-spacing: v.$letter-spacing-wide;
  }

  .forgot-pwd-link {
    font-size: var(--app-font-size-sm); 
  }

  .recaptcha-box {
    border: 1px solid v.$vieshow-tertiary; 
    border-radius: var(--app-radius-sm); 
    padding: var(--gap-sm) var(--gap-md); 
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(v.$black, 0.05); 
    transition: all 0.2s ease;

    .check-box {
      width: var(--app-font-size-h4);
      height: var(--app-font-size-h4); 
      height: 1.5rem;
      border: 2px solid v.$vieshow-tertiary; 
      border-radius: 2px; 
      transition: all 0.2s ease;
    }

    .robot-text{
      font-size: var(--app-font-size-sm); 
    }

    .recaptcha-terms {
      font-size: 0.65rem; 
      flex-wrap: nowrap;
    }

    &:hover {
      box-shadow: 0 4px 8px rgba(v.$black, 0.1);

      .check-box {
        border-color: v.$vieshow-secondary; 
      }
    }
  }

  .login-btn {
    padding: var(--gap-sm); 
    border-radius: var(--app-radius-lg);
    font-size: var(--app-font-size-base);
    background-color: v.$vieshow-primary-dark;
  }

  .google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    color: v.$vieshow-primary;
    border-radius: var(--app-radius);
    font-size: var(--app-font-size-base);
    transition: all 0.2s ease;
    overflow: hidden;

    &:hover {
      background-color: rgba(v.$vieshow-secondary, 0.1) !important;
    }
  }

  .register-hint {
    font-size: var(--app-font-size-sm); 
    .register-link {
      color: v.$vieshow-primary;
      &:hover {
        color: v.$vieshow-primary-dark;
      }
    }
  }
}
</style>