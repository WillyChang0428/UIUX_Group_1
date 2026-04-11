<template>
  <BaseModal v-model="isOpen" type="base">
    <template #title>請先登入會員</template>

    <template #content>
      <div class="login-form-wrapper p-3">
        <div class="input-group position-relative mb-4">
          <input
            type="email"
            class="form-control custom-input"
            placeholder="帳號"
            v-model.trim="email"
            @keyup.enter="handleLogin"
          />
        </div>

        <div class="input-group position-relative mb-1">
          <input
            :type="showPassword ? 'text' : 'password'"
            class="form-control custom-input"
            placeholder="密碼"
            v-model.trim="password"
            @keyup.enter="handleLogin"
          />
          <span class="password-toggle" @click="showPassword = !showPassword">
            <i
              :class="['fa-regular', showPassword ? 'fa-eye' : 'fa-eye-slash']"
            ></i>
          </span>
        </div>

        <div style="height: 24px" class="mb-2">
          <div
            v-if="errorMessage"
            class="error-text text-danger d-flex align-items-center gap-1"
          >
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>{{ errorMessage }}</span>
          </div>
        </div>

        <div class="d-flex justify-content-end mb-3">
          <a
            href="#"
            class="text-secondary text-decoration-none forgot-pwd-link"
            >忘記密碼？</a
          >
        </div>

        <div
          class="recaptcha-box d-flex justify-content-between align-items-center mb-4 gap-2"
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
          class="w-100 fw-bold mb-3 login-btn"
          @click="handleLogin"
        >
          登入
        </SecondaryButton>

        <div class="text-center text-secondary register-hint pb-2">
          還不是會員？
          <a href="#" class="register-link text-decoration-none fw-medium"
            >立即註冊</a
          >
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/store/authStore";
import BaseModal from "@/components/Common/Button/BaseModal.vue";
import SecondaryButton from "@/components/Common/Button/SecondaryButton.vue";

// 💡 宣告 v-model 與 emit
const isOpen = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["success"]);

const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isRobotChecked = ref(false);
const errorMessage = ref("");

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

  // 執行登入 (Store 裡面已經做過去空白和轉小寫了)
  const isSuccess = authStore.login(email.value, password.value);

  if (isSuccess) {
    isOpen.value = false; // 1. 關閉彈窗
    emit("success"); // 2. 呼叫老爸 (BottomBar) 說我成功了！
  } else {
    errorMessage.value = "帳號或密碼錯誤，請重新輸入";
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.custom-input {
  background: transparent !important;
  border: none;
  border-bottom: 1px solid rgba($white, 0.3);
  border-radius: 0;
  color: $white;
  padding: var(--gap-sm) var(--gap-sm) var(--gap-sm) 0;
  font-size: var(--app-font-size-base);
  box-shadow: none !important;

  &:focus {
    border-bottom-color: $vieshow-primary;
  }
  &::placeholder {
    color: rgba($white, 0.5);
  }
}

.password-toggle {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: rgba($white, 0.5);
  z-index: 10;
  padding: var(--gap-sm);
  &:hover {
    color: $white;
  }
}

.error-text {
  font-size: var(--app-font-size-sm);
  letter-spacing: $letter-spacing-wide;
}
.forgot-pwd-link {
  font-size: var(--app-font-size-sm);
}

.recaptcha-box {
  border: 1px solid $vieshow-tertiary;
  border-radius: var(--app-radius-sm);
  padding: var(--gap-sm) var(--gap-md);
  cursor: pointer;
  .check-box {
    width: 24px;
    height: 24px;
    border: 2px solid $vieshow-tertiary;
    border-radius: 2px;
  }
  .recaptcha-terms {
    font-size: 10px;
  }
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    .check-box {
      border-color: $vieshow-secondary;
    }
  }
}

.login-btn {
  padding: var(--gap-sm);
  border-radius: var(--app-radius-lg);
  background-color: $vieshow-primary-dark;
}

.register-hint {
  font-size: var(--app-font-size-sm);
  .register-link {
    color: $vieshow-primary;
    &:hover {
      color: $vieshow-primary-dark;
    }
  }
}
</style>
