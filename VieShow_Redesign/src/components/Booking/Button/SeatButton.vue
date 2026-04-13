<!-- 使用方法:
<SeatButton size="sm/md/lg" state="available" />
<SeatButton size="sm/md/lg" state="wheelchair" />
<SeatButton size="sm/md/lg" state="sold" />
<SeatButton size="sm/md/lg" state="selected" /> 
-->

<template>
    <button class="seat-btn" :class="[`size-${size}`, `is-${state}`]" :disabled="isDisabled" @click="handleClick"
        :aria-label="ariaLabel">
        <i v-if="state === 'wheelchair'" class="fa-solid fa-wheelchair icon"></i>
    </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    // 狀態：'available' (可選), 'wheelchair' (殘障), 'sold' (售出/打叉), 'selected' (正選取)
    state: {
        type: String,
        default: 'available',
        validator: (value) => ['available', 'wheelchair', 'sold', 'selected'].includes(value)
    },
    // 尺寸：'sm' (20px), 'md' (30px), 'lg' (50px)
    size: {
        type: String,
        default: 'md',
        validator: (value) => ['sm', 'md', 'lg'].includes(value)
    }
});

const emit = defineEmits(['click']);

// 判斷是否為不可點擊狀態 (殘障位與已售出位不可點)
const isDisabled = computed(() => ['wheelchair', 'sold'].includes(props.state));

const handleClick = () => {
    if (!isDisabled.value) {
        emit('click');
    }
};

// 無障礙語音提示設定
const ariaLabel = computed(() => {
    switch (props.state) {
        case 'wheelchair': return '輪椅專屬座位，無法一般選取';
        case 'sold': return '已售出座位，無法選取';
        case 'selected': return '已選取座位，點擊取消';
        default: return '可選取座位';
    }
});
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.seat-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
    outline: none;
    transition: all 0.2s ease-in-out;
    position: relative;
    overflow: hidden; // 確保打叉的線條不會超出圓角

    /* ==========================================
     尺寸設定 (Size) - 對應圖一的三種大小
     ========================================== */
    &.size-sm {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        border-width: 1px;

        .icon {
            font-size: 10px;
        }
    }

    &.size-md {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        border-width: 1.5px;

        .icon {
            font-size: 16px;
        }
    }

    &.size-lg {
        width: 50px;
        height: 50px;
        border-radius: 10px;
        border-width: 2px;

        .icon {
            font-size: 26px;
        }
    }

    /* ==========================================
     狀態設定 (State)
     ========================================== */

    /* 1. 可選取 (最左：透明底、白灰框) */
    &.is-available {
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), v.$white;
        border: 1.5px solid transparent;
        border-style: solid;
        border-color: v.$white;
        cursor: pointer;

        @include hover-focus {
            border-color: v.$vieshow-primary;
            background-color: rgba(v.$vieshow-primary, 0.1); // Hover 時給予微微的藍色反饋
        }
    }

    /* 2. 殘障專位 (左二：深灰底、白 Icon) */
    &.is-wheelchair {
        background-color: v.$vieshow-secondary-emp; // #4A4A4A
        color: v.$white;
        border: 1.5px solid transparent; // 隱形邊框防跳動
        cursor: not-allowed;
    }

    /* 3. 已被選取/售出 (左三：暗灰底、黑色大叉叉) */
    &.is-sold {
        background-color: v.$vieshow-dark-section; 
        border: 1.5px solid transparent;
        cursor: not-allowed;

        // 利用偽元素畫出完美的對角線叉叉
        &::before,
        &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 150%; // 確保線條夠長能觸及角落
            background-color: v.$vieshow-dark; // 叉叉的顏色 (極暗)
        }

        // 依據不同尺寸微調叉叉的粗細
        &.size-sm::before,
        &.size-sm::after {
            height: 1.5px;
        }

        &.size-md::before,
        &.size-md::after {
            height: 2px;
        }

        &.size-lg::before,
        &.size-lg::after {
            height: 3px;
        }

        &::before {
            transform: translate(-50%, -50%) rotate(45deg);
        }

        &::after {
            transform: translate(-50%, -50%) rotate(-45deg);
        }
    }

    /* 4. 正選取中 (最右：威秀藍滿版) */
    &.is-selected {
        background-color: v.$vieshow-primary;
        border-style: solid;
        border-color: v.$vieshow-primary;
        cursor: pointer;

        @include hover-focus {
            background-color: v.$vieshow-primary-dark;
            border-color: v.$vieshow-primary-dark;
        }
    }
}
</style>