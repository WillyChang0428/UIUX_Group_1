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
  <div
    class="base-select-container w-100"
    ref="selectRef"
    :class="{ 'is-open': isOpen, 'is-selected': isSelected }"
  >
    <div
      class="select-header d-flex align-items-center justify-content-between px-3 py-2"
      @click="$emit('toggle')"
    >
      <span class="placeholder flex-grow-1 text-start bg-transparent">
        <slot name="selected">{{ props.placeholder }}</slot>
      </span>
      <div class="icon-wrapper ms-2">
        <i
          v-if="isSelected && !isOpen"
          class="fa-solid fa-angle-down icon-sm"
          @click.stop="$emit('clear')"
        ></i>
        <i
          v-else
          :class="[
            isOpen ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down',
            'icon-sm',
          ]"
        ></i>
      </div>
    </div>

    <Transition name="fade-down">
      <div v-if="isOpen" class="select-dropdown w-100 shadow-sm">
        <ul class="options-list p-2 m-0 list-unstyled">
          <slot name="options"></slot>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  isOpen: Boolean,
  isSelected: Boolean,
  placeholder: {
    type: String,
    default: "請選擇選項",
  },
});

const emit = defineEmits(["toggle", "clear", "close"]);

const selectRef = ref(null);

const handleClickOutside = (event) => {
  if (
    props.isOpen &&
    selectRef.value &&
    !selectRef.value.contains(event.target)
  ) {
    emit("toggle");
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped lang="scss">
.base-select-container {
  position: relative;

  .select-header {
    background-color: transparent !important;
    // 💡 呼叫響應式圓角與邊框顏色 [cite: 39, 148, 161]
    border: 1px solid v.$vieshow-secondary-emp;
    border-radius: var(--app-radius);
    min-height: 48px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: transparent;

    .placeholder {
      /* 💡 核心修正：強制單行並顯示省略號 */
      white-space: nowrap;      // 強制文字不換行
      overflow: hidden;         // 隱藏超出容器的內容
      text-overflow: ellipsis;  // 在結尾顯示 "..."
      display: block;           // 確保寬度限制生效
      width: 100%;             // 佔滿父容器空間
      padding-right: 10px;      // 預留一點空間給右側箭頭
      min-height: auto;
      background: transparent !important;
      box-shadow: none !important; // 💡 防止陰影產生的色塊感
      border: none !important; // 💡 防止內部 slot 產生邊框
      // 💡 字體大小自動縮放：手機 16px / 電腦 18px
      font-size: var(--app-font-size-base);
      color: v.$vieshow-secondary;
      user-select: none;
      pointer-events: none;

      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
        transition: background-color 5000s ease-in-out 0s;
      }
    }

    .icon-wrapper {
      color: v.$vieshow-secondary;
      pointer-events: none;
    }
  }

  // 💡 選中狀態：對齊品牌藍 [cite: 98, 160]
  &.is-selected {
    .select-header {
      background-color: transparent !important; // 💡 確保選中時背景依然透明
      border-color: rgba(v.$vieshow-primary, 0.8) !important;

      .placeholder {
        color: v.$vieshow-primary !important;
        opacity: 1 !important;
        font-weight: v.$font-weight-medium !important;
        // 確保沒有任何 Bootstrap 的 secondary 灰色殘留
        filter: brightness(1.2);
        background-color: transparent !important;
      }
    }
  }

  &.is-open {
    .select-header {
      border-color: v.$white;
      box-shadow: 0 0 8px rgba(v.$white, 0.2);
    }
  }

  .select-dropdown {
    position: absolute;
    top: calc(100% + var(--gap-xs)); // 間距：手機 4px / 電腦 8px
    left: 0;
    background-color: v.$vieshow-dark-section; // #2C2C2C
    border: 1px solid v.$vieshow-secondary-emp;
    border-radius: var(--app-radius);
    z-index: 100;
    overflow: hidden;

    .options-list {
      max-height: 300px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none;
      }

      // 💡 穿透插槽 li 樣式
      :deep(li) {
        padding: 16px 16px; // 手機 8px/16px, 電腦 16px/32px [cite: 38, 59, 131]
        color: v.$white;
        font-size: var(--app-font-size-base);
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          color: v.$vieshow-primary;
        }
      }
    }
  }
}

/* 💡 動態過渡效果維持 CSS (指南允許非標準動畫) [cite: 127] */
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
