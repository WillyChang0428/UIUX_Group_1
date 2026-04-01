<!--使用方式：

<PrimaryButton>立即訂票</PrimaryButton>

<PrimaryButton status="warning">取消訂單</PrimaryButton>

<PrimaryButton status="unable" is-disabled>尚未開放</PrimaryButton>

<PrimaryButton status="secondary">返回列表</PrimaryButton>

 -->

<template>
    <button class="base-btn" :class="[variant, { 'disabled': isDisabled }]" :disabled="isDisabled"
        @click="$emit('click')">
        <slot>主按鈕</slot>
    </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    // 狀態選擇：default, unable, press, warning, secondary
    status: {
        type: String,
        default: 'default'
    },
    // 是否禁用
    isDisabled: {
        type: Boolean,
        default: false
    }
})

defineEmits(['click'])

// 根據 status 轉化為 CSS class
const variant = computed(() => `btn-${props.status}`)
</script>

<style scoped lang="scss">
.base-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-radius: 8px; // 根據設計稿調整圓角
    border: none;
    color: white;
    font-weight: 500;
    font-size: v.$h6-font-size;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 100px;
    letter-spacing: 0.1em;

    // 1. Default (品牌藍漸層)
    &.btn-default {
        background: v.$vieshow-primary;
    }

    // 2. Unable (禁用灰色)
    &.btn-unable,
    &:disabled {
        background-color: #C0C0C0; // 或 v.$vieshow-secondary-emp
        cursor: not-allowed;
        opacity: 0.8;
        // 💡 關鍵：禁止所有滑鼠與觸控事件
        pointer-events: none;

        // 讓點擊反饋（如 scale）在禁用時失效
        &:active {
            transform: none;
        }
    }

    // 3. Press (深藍色)
    &.btn-press,
    &:active {
        // 利用多層背景：最上層是 60% 透明黑，底層是品牌主色
        background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
            v.$vieshow-primary;
        // 實作 Figma 的 1px Inside Stroke (內邊框)
        // 使用 inset box-shadow 不會影響按鈕實際大小
        box-shadow: inset 0 0 0 2px v.$vieshow-primary;

        // 維持你想要的縮小壓入感
        transform: scale(0.96);

        // 確保文字依然清晰
        color: rgba(white, 0.9);
    }

    // 4. Warning (警告紅)
    &.btn-warning {
        background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
            v.$vieshow-danger;
        box-shadow: inset 0 0 0 1px v.$vieshow-danger;
    }

    // 5. Second Choice (深灰色)
    &.btn-secondary {
        background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
            v.$vieshow-secondary;
    }

    // 桌機端 Hover 微光效果
    @include v.hover-focus {
        filter: brightness(1.1);
    }
}
</style>
