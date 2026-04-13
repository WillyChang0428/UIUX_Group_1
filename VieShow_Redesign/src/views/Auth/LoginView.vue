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

        <div class="action-btn-group">
          <SecondaryButton class="w-100 login-btn" @click="handleLogin">
            登入
          </SecondaryButton>

          <GoogleLoginBtn 
            class="w-100" 
            :width="380" 
            @success="handleGoogleLogin" 
          />
        </div>

        <div class="text-center text-secondary register-hint mt-3">
          還不是會員？
          <router-link
            to="/SignUp"
            target="_blank" 
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
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { jwtDecode } from "jwt-decode";
import BaseModal from "@/components/Common/Button/BaseModal.vue";
import SecondaryButton from "@/components/Common/Button/SecondaryButton.vue";
import GoogleLoginBtn from "@/components/Common/Button/GoogleLoginBtn.vue";

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
  try {
    if (!response.credential) return;
    const decoded = jwtDecode(response.credential);
    const googleEmail = decoded.email;
    const result = authStore.startGoogleRegistration(googleEmail);

    if (result.action === 'login') {
      isOpen.value = false; 
      emit("success"); 
    } 
    else if (result.action === 'register') {
      isOpen.value = false; 
      const routeUrl = router.resolve({ path: '/SignUp/SignUpStep1' }).href;
      window.open(routeUrl, '_blank');
    }
  } catch (error) {
    console.error("Google 登入解析錯誤:", error);
  }
};

const handleClose = () => {
  isOpen.value = false;
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

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
    box-shadow: none !important;
    &:focus { border-bottom-color: v.$vieshow-primary; }
  }

  .password-toggle {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: rgba(v.$white, 0.5);
    padding: var(--gap-sm);
  }

  /* ==========================================
    🌟 修正後的按鈕佈局 (Grid 是強制對齊的神器)
     ========================================== */
  .action-btn-group {
    display: grid;         /* 1. 啟用網格佈局 */
    grid-template-columns: 1fr; /* 2. 只有一欄，代表橫向填滿 */
    width: 100%;
    gap: 1rem;             /* 按鈕間距 */

    .login-btn {
      height: 40px;
      width: 100%;         /* 強制 100% */
      border-radius: var(--app-radius-lg);
      background-color: v.$vieshow-primary-dark;
    }

    .google-custom-btn {
      width: 100% !important;
      height: 40px;
      display: flex;
      justify-content: center;

      /* 🌟 核心：穿透進去把 Google 的所有容器都拉到 100% */
      :deep(div), :deep(iframe) {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 100% !important;
      }
    }
  }

  .register-hint {
    font-size: var(--app-font-size-sm);
    .register-link {
      color: v.$vieshow-primary;
    }
  }
}
</style>