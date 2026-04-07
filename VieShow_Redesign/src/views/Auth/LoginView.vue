<template>
    <BaseModal v-model="isOpen" type="base" @close="handleClose">
        <template #title>登入</template>

        <template #content>
            <div class="login-form-wrapper">

                <div class="input-group position-relative mb-4">
                    <input type="email" class="form-control custom-input" placeholder="帳號" v-model="email"
                        @keyup.enter="handleLogin" />
                </div>

                <div class="input-group position-relative mb-2">
                    <input :type="showPassword ? 'text' : 'password'" class="form-control custom-input" placeholder="密碼"
                        v-model="password" @keyup.enter="handleLogin" />
                    <span class="password-toggle" @click="showPassword = !showPassword">
                        <i :class="['fa-regular', showPassword ? 'fa-eye' : 'fa-eye-slash']"></i>
                    </span>
                </div>

                <div class="error-text text-danger mb-2" style="min-height: 20px;">
                    <span v-if="errorMessage"><i class="fa-solid fa-circle-exclamation me-1"></i>{{ errorMessage
                        }}</span>
                </div>

                <div class="d-flex justify-content-end mb-4">
                    <a href="#" class="text-secondary text-decoration-none" style="font-size: 14px;">忘記密碼？</a>
                </div>

                <div class="recaptcha-box d-flex justify-content-between align-items-center mb-4"
                    @click="isRobotChecked = !isRobotChecked">
                    <div class="d-flex align-items-center gap-3">
                        <i class="fa-solid fa-check text-success fs-4" v-if="isRobotChecked"></i>
                        <div class="check-box" v-else></div>
                        <span class="text-dark">I'm not a robot</span>
                    </div>
                    <div class="recaptcha-logo d-flex flex-column align-items-center">
                        <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" width="28">
                        <span class="text-muted mt-1" style="font-size: 9px;">Privacy - Terms</span>
                    </div>
                </div>

                <SecondaryButton class="w-100 fw-bold mb-3 login-btn" @click="handleLogin">
                    登入
                </SecondaryButton>

                <GoogleLogin :callback="handleLogin" class="google-btn w-100 mb-3" />


                <div class="text-center text-secondary" style="font-size: 14px;">
                    還不是會員？
                    <router-link to="/register" class="text-primary text-decoration-none fw-bold">立即註冊</router-link>
                </div>

            </div>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore'; // 引入我們寫好的 Store
import BaseModal from '@/components/Common/Button/BaseModal.vue'; // 請確認路徑是否正確
import SecondaryButton from '@/components/Common/Button/SecondaryButton.vue';

const router = useRouter();
const authStore = useAuthStore();

// 狀態管理
const isOpen = ref(true);
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isRobotChecked = ref(false);
const errorMessage = ref('');

// 💡 一般帳號密碼登入邏輯
const handleLogin = () => {
    errorMessage.value = ''; // 清空之前的錯誤

    // 1. 基礎防呆驗證
    if (!email.value || !password.value) {
        errorMessage.value = '請輸入帳號與密碼';
        return;
    }
    if (!isRobotChecked.value) {
        errorMessage.value = '請勾選「我不是機器人」進行驗證';
        return;
    }

    // 2. 呼叫 Pinia Store 進行驗證
    const isSuccess = authStore.login(email.value, password.value);

    if (isSuccess) {
        // 登入成功：關閉 Modal 並跳轉回首頁
        isOpen.value = false;
        setTimeout(() => {
            router.push('/');
        }, 300); // 稍微延遲讓 Modal 關閉動畫跑完
    } else {
        // 登入失敗：顯示錯誤提示
        errorMessage.value = '帳號或密碼錯誤，請重新輸入';
    }
};


// 處理點擊 X 關閉視窗的邏輯
const handleClose = () => {
    router.push('/'); // 返回首頁或上一頁
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables"; // 引入您的設計系統變數

.login-form-wrapper {
    padding: 10px 0;

    /* ==========================================
     1. 自定義無邊框輸入框 (底線樣式)
     ========================================== */
    .custom-input {
        background: transparent !important;
        border: none;
        border-bottom: 1px solid rgba(v.$white, 0.3); // 預設微透明白線
        border-radius: 0;
        color: v.$white;
        padding: 12px 10px 12px 0; // 左側切齊
        font-size: var(--app-font-size-base);
        transition: all 0.3s ease;
        box-shadow: none !important;

        // 聚焦時，底線變為品牌藍
        &:focus {
            border-bottom-color: v.$vieshow-primary;
        }

        // 提示字顏色
        &::placeholder {
            color: rgba(v.$white, 0.5);
        }

        // 修正瀏覽器自動填寫時的黃色/白色背景殘留
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
        padding: 10px;

        &:hover {
            color: v.$white;
        }
    }

    .error-text {
        font-size: 13px;
        letter-spacing: 0.5px;
    }

    /* ==========================================
     2. 模擬 reCAPTCHA 驗證區塊
     ========================================== */
    .recaptcha-box {
        background-color: #F9F9F9; // 淺灰底色
        border: 1px solid #D3D3D3;
        border-radius: 4px;
        padding: 12px 16px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        transition: all 0.2s ease;

        .check-box {
            width: 24px;
            height: 24px;
            background: v.$white;
            border: 2px solid #C1C1C1;
            border-radius: 2px;
            transition: all 0.2s ease;
        }

        &:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

            .check-box {
                border-color: #A0A0A0;
            }
        }
    }

    /* ==========================================
     3. 按鈕樣式微調
     ========================================== */
    .login-btn {
        padding: 12px;
        border-radius: var(--app-radius-lg); // 使用指南中的大圓角
        font-size: var(--app-font-size-base);
    }

    .google-btn {
        color: v.$vieshow-primary;
        border: 1px solid v.$white;
        padding: 12px;
        border-radius: var(--app-radius-lg);
        font-size: var(--app-font-size-base);
        transition: all 0.2s ease;

        &:hover {
            background-color: #F0F0F0 !important;
        }
    }
}
</style>