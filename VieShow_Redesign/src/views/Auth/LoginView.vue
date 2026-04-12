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
            <i
              :class="['fa-regular', showPassword ? 'fa-eye' : 'fa-eye-slash']"
            ></i>
          </span>
        </div>

        <div class="error-text text-danger mt-1">
          <span v-if="errorMessage">
            <i class="fa-solid fa-circle-exclamation me-1"></i
            >{{ errorMessage }}
          </span>
        </div>

        <div class="d-flex justify-content-end mb-3">
          <a
            href="#"
            class="text-secondary text-decoration-none forgot-pwd-link"
            >忘記密碼？</a
          >
        </div>

        <div
          class="recaptcha-box d-flex justify-content-between align-items-center mb-4 mb-lg-3 gap-2"
          @click="isRobotChecked = !isRobotChecked"
        >
          <div class="d-flex align-items-center gap-3">
            <i
              class="fa-solid fa-check text-success fs-4"
              v-if="isRobotChecked"
            ></i>
            <div class="check-box" v-else></div>
            <span class="text-white">I'm not a robot</span>
          </div>
          <div class="recaptcha-logo d-flex flex-column align-items-center">
            <img
              src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
              alt="reCAPTCHA"
              width="28"
            />
            <span class="text-tertiary mt-1 recaptcha-terms"
              >Privacy - Terms</span
            >
          </div>
        </div>

        <SecondaryButton
          class="w-100 fw-bold mb-3 mb-lg-2 login-btn"
          @click="handleLogin"
        >
          登入
        </SecondaryButton>

        <GoogleLogin :callback="handleGoogleLogin" class="google-btn w-100 mb-3" />

        <div class="text-center text-secondary register-hint">
          還不是會員？
          <router-link
            to="/SignUp"
            class="register-link text-decoration-none fw-medium"
            >立即註冊</router-link
          >
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import BaseModal from "@/components/Common/Button/BaseModal.vue";
import SecondaryButton from "@/components/Common/Button/SecondaryButton.vue";


const router = useRouter();
const authStore = useAuthStore();

// 💡 核心修正 1：使用 defineModel 來接收 Header 傳來的 v-model="isLoginOpen"
// 這樣 isOpen.value = false 時，Header 也會同步知道彈窗關閉了
const isOpen = defineModel({ type: Boolean, default: false });

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isRobotChecked = ref(false);
const errorMessage = ref("");

// 一般帳號密碼登入邏輯
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

  const isSuccess = authStore.login(email.value, password.value);

  if (isSuccess) {
    // 💡 核心修正 2：登入成功後，單純關閉彈窗即可，不用 router.push 跳轉！
    isOpen.value = false;
  } else {
    errorMessage.value = "帳號或密碼錯誤，請重新輸入";
  }
};

// 🌟 處理 Google 按鈕回傳的專屬邏輯
const handleGoogleLogin = (response) => {
  // 1. 取得 Google 回傳的 Email 
  // ⚠️ 備註：這裡取決於你的 GoogleLogin 組件怎麼寫。
  // 如果是官方預設按鈕，通常需要 decodeCredential(response.credential).email
  const googleEmail = response.email; 

  if (!googleEmail) {
    errorMessage.value = "無法取得 Google 帳號資訊，請重試";
    return;
  }

  // 2. 呼叫 Store 的判斷邏輯
  const result = authStore.startGoogleRegistration(googleEmail);

  // 3. 根據結果決定彈窗與路由的動向
  if (result.action === 'login') {
    // 【情境 A：老會員】
    console.log("歡迎回來，老朋友！");
    isOpen.value = false; // 直接關閉登入彈窗，此時 Navbar 應該會變更為已登入狀態
    
  } else if (result.action === 'register') {
    // 【情境 B：新朋友】
    console.log("發現新朋友，準備跳轉至註冊流程！");
    isOpen.value = false; // 先把登入彈窗關掉
    // 直接導向註冊流程的 Step 3 (填寫身分證與手機)
    router.push('/SignUp/SignUpStep3'); 
  }
};
// 處理點擊 X 關閉視窗的邏輯
const handleClose = () => {
  // 💡 核心修正 3：點擊 X 也是單純關閉彈窗
  isOpen.value = false;
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.login-form-wrapper {
  padding: 0;

  /* ==========================================
     1. 自定義無邊框輸入框 (底線樣式)
     ========================================== */
  .custom-input {
    background: transparent !important;
    border: none;
    border-bottom: 1px solid rgba(v.$white, 0.3);
    border-radius: 0;
    color: v.$white;
    // 💡 12px 10px 替換為響應式間距
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

  // 眼睛圖示定位
  .password-toggle {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: rgba(v.$white, 0.5);
    z-index: 10;
    padding: var(--gap-sm); // 💡 取代 10px

    &:hover {
      color: v.$white;
    }
  }

  // 💡 獨立拉出錯誤文字與連結的樣式，取代 inline-style
  .error-text {
    font-size: var(--app-font-size-mini); // 對應 12px/14px
    letter-spacing: v.$letter-spacing-wide;
  }

  .forgot-pwd-link {
    font-size: var(--app-font-size-sm); // 💡 取代 14px
  }

  /* ==========================================
     2. 模擬 reCAPTCHA 驗證區塊
     ========================================== */
  .recaptcha-box {
    border: 1px solid v.$vieshow-tertiary; // 💡 取代 #D3D3D3
    border-radius: var(--app-radius-sm); // 💡 取代 4px
    padding: var(--gap-sm) var(--gap-md); // 💡 取代 12px 16px
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(v.$black, 0.05); // 💡 改用 v.$black
    transition: all 0.2s ease;

    .check-box {
      width: var(--app-font-size-h4);
      height: var(--app-font-size-h4); // 💡 取代 24px
      height: 1.5rem;
      border: 2px solid v.$vieshow-tertiary; // 💡 取代 #C1C1C1
      border-radius: 2px; // 極小圓角保留
      transition: all 0.2s ease;
    }

    .recaptcha-terms {
      font-size: 0.65rem; // 💡 取代 9px
    }

    &:hover {
      box-shadow: 0 4px 8px rgba(v.$black, 0.1);

      .check-box {
        border-color: v.$vieshow-secondary; // 💡 取代 #A0A0A0
      }
    }
  }

  /* ==========================================
     3. 按鈕樣式微調
     ========================================== */
  .login-btn {
    padding: var(--gap-sm); // 💡 取代 12px
    border-radius: var(--app-radius-lg);
    font-size: var(--app-font-size-base);
    background-color: v.$vieshow-primary-dark;
  }

  .google-btn {
    color: v.$vieshow-primary;
    border-radius: var(--app-radius);
    font-size: var(--app-font-size-base);
    transition: all 0.2s ease;
    overflow: hidden;

    &:hover {
      // 💡 取代死白的 #F0F0F0，改用具語意化的 rgba 輔助色
      background-color: rgba(v.$vieshow-secondary, 0.1) !important;
    }
  }

  .register-hint {
    font-size: var(--app-font-size-sm); // 💡 取代 14px
    .register-link {
      color: v.$vieshow-primary;
      &:hover {
        color: v.$vieshow-primary-dark;
      }
    }
  }
}
</style>
