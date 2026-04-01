<!-- * * --- 完整範例 (請複製到父組件使用) ---
<script setup>
import { ref } from 'vue'
import FlatSelect from '@/components/Common/Selecter/FlatSelect.vue'
import SelectCategory from '@/components/Common/Selecter/SelectCategory.vue'

const isOpen = ref(false)         // 控制選單開關
const isSelected = ref(false)     // 控制藍色選中樣式
const selectedValue = ref('')     // 儲存選中的文字內容

 // 處理選中動作
const handleSelect = (val) => {
selectedValue.value = val;      // 更新顯示文字
isSelected.value = true;        // 切換為藍色高亮
isOpen.value = false;           // 自動收合選單
}
</script>

<template>
<FlatSelect 
:isOpen="isOpen" 
:isSelected="isSelected" 
:placeholder="selectedValue || '預設提示文字'" 
@toggle="isOpen = !isOpen"
@clear="selectedValue = ''; isSelected = false"
>
<template #options>
<li @click="handleSelect('選項 A')">選項 A</li>
<li @click="handleSelect('選項 B')">選項 B</li>
    <SelectCategory label="第二層選項">
        <li @click="handleSelect('選項 A')">選項 A</li>
        <li @click="handleSelect('選項 B')">選項 B</li>
    </SelectCategory>
</template>
</FlatSelect>
</template> 
-->


<template>
    <div class="base-select-container" ref="selectRef" :class="{ 'is-open': isOpen, 'is-selected': isSelected }">
        <div class="select-header" @click="$emit('toggle')">
            <span class="placeholder">
                <slot name="selected">{{ props.placeholder }}</slot>
            </span>
            <div class="icon-wrapper">
                <i v-if="isSelected && !isOpen" class="fa-solid fa-angle-down" @click.stop="$emit('clear')"></i>
                <i v-else :class="isOpen ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down'"></i>
            </div>
        </div>

        <Transition name="fade-down">
            <div v-if="isOpen" class="select-dropdown">
                <ul class="options-list">
                    <slot name="options"></slot>
                </ul>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    isSelected: Boolean,
    placeholder: {
        type: String,
        default: '請選擇選項'
    }
});

const emit = defineEmits(['toggle', 'clear', 'close']); // 💡 新增 close 事件

// 1. 建立一個 ref 來綁定組件的最外層 DOM
const selectRef = ref(null);

// 2. 判斷點擊位置的函式
const handleClickOutside = (event) => {
    // 如果選單是開著的，且點擊的目標「不在」這個組件內部
    if (props.isOpen && selectRef.value && !selectRef.value.contains(event.target)) {
        emit('toggle'); // 或是 emit('close')，通知父組件把 isOpen 設為 false
    }
};

// 3. 掛載監聽器
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

// 4. 移除監聽器 (重要！防止效能問題)
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.base-select-container {
    position: relative;
    width: 100%;
    max-width: 500px;
    font-family: 'Noto Sans TC', sans-serif;

    .select-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 20px;
        background-color: transparent;
        border: 1px solid v.$vieshow-secondary;
        border-radius: 12px;
        cursor: pointer !important; // 💡 強制讓它變成手指
        transition: all 0.3s ease;

        .placeholder {
            flex-grow: 1; // 💡 關鍵：確保文字區塊撐開，不會縮成一團
            text-align: left;
            color: v.$vieshow-primary !important;
            background: transparent !important;
            font-size: v.$font-size-base;
            user-select: none;
            display: block; // 確保它是塊級顯示
            min-height: 1.5em; // 確保就算沒字也有高度
            pointer-events: none; // 💡 讓內層不干擾滑鼠事件，統一由 header 處理

            // 💡 修復 Chrome 自動填入的藍色塊問題
            &:-webkit-autofill {
                -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
                transition: background-color 5000s ease-in-out 0s;
            }
        }

        .icon-wrapper {
            color: v.$vieshow-secondary;
            font-size: 14px;
            margin-left: 10px;
            pointer-events: none; // 💡 讓內層不干擾滑鼠事件，統一由 header 處理
        }
    }

    // 狀態切換
    &.is-selected {
        .select-header {
            // 💡 增加邊框亮度，讓整體更有「選中感」
            border-color: rgba(v.$vieshow-primary, 0.5);

            .placeholder {
                // 💡 確保使用不帶透明度的純色，並強制覆蓋
                color: v.$vieshow-primary !important; // 直接用你的品牌亮藍色
                font-weight: 400; // 稍微加粗一點，視覺上會更亮
                text-shadow: 0px 0px 8px rgba(47, 150, 238, 0.3); // 微弱發光，增加質感
                opacity: 1 !important; // 確保沒有任何透明度干擾
            }
        }
    }

    &.is-open {
        .select-header {
            border-color: v.$white;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);

            .placeholder {
                color: v.$vieshow-primary !important;
                background: transparent !important;
            }
        }
    }

    .select-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        width: 100%;
        background-color: #1A1A1A;
        border: 1px solid v.$vieshow-secondary-emp;
        border-radius: 12px;
        z-index: 100;
        overflow: hidden;

        .options-list {
            list-style: none;
            padding: 8px 0;
            margin: 0;
            max-height: 300px;
            overflow-y: auto;

            &::-webkit-scrollbar {
                display: none;
            }

            :deep(li) {
                padding: 12px 20px;
                color: v.$white;
                cursor: pointer;


            }
        }
    }
}

// 動態效果
.fade-down-enter-active,
.fade-down-leave-active {
    transition: all 0.2s ease;
}

.fade-down-enter-from,
.fade-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>