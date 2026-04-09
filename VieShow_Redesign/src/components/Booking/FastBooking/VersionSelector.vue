<template>
  <div class="version-selector d-inline-flex align-items-center" @click="toggleExpand">
    
    <div class="grid-anim-container label-container" :class="{ 'is-hidden': isExpanded }">
      <div class="grid-anim-content d-flex align-items-center">
        <div class="version-display fw-bold" :class="{ 'is-choosed': modelValue !== '所有版本' }">
          {{ displayLabel(modelValue) }}
        </div>
      </div>
    </div>

    <div class="grid-anim-container list-container" :class="{ 'is-expanded': isExpanded }">
      <div class="grid-anim-content d-flex align-items-center">
        <div class="version-list d-flex align-items-center">
          <span
            class="version-item fw-bold"
            :class="{ 'is-active': modelValue === '所有版本' }"
            @click.stop="selectVersion('所有版本')"
          >
            所有版本
          </span>
          <span
            v-for="format in availableFormats"
            :key="format"
            class="version-item fw-bold"
            :class="{ 'is-active': modelValue === format }"
            @click.stop="selectVersion(format)"
          >
            {{ displayLabel(format) }}
          </span>
        </div>
      </div>
    </div>

    <i
      class="fa-solid fa-angle-right ms-2 icon-sm"
      :class="{ 
        'is-expanded': isExpanded, 
        'is-choosed': modelValue !== '所有版本' || isExpanded 
      }"
    ></i>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  availableFormats: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["update:modelValue", "change"]);
const isExpanded = ref(false);

// 💡 處理字串顯示：如果是特定版本，自動補上「 / 英」對齊設計稿
const displayLabel = (val) => {
  if (val === '所有版本') return val;
  return `${val} / 英`;
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const selectVersion = (format) => {
  emit("update:modelValue", format);
  emit("change", format);
  isExpanded.value = false; // 選完自動收合
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.version-selector {
  cursor: pointer;
  // 💡 對應圖一中的 14pt (輔助文)
  font-size: var(--app-font-size-sm); 
  user-select: none;
  min-height: 45px; // 確保觸控熱區
}

/* --- 動態寬度核心 (CSS Grid) --- */
.grid-anim-container {
  display: grid;
  transition: grid-template-columns 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.grid-anim-content {
  min-width: 0; 
  overflow: hidden; 
  transition: opacity 0.3s ease;
}

.label-container {
  grid-template-columns: 1fr;
  &.is-hidden {
    grid-template-columns: 0fr;
    .grid-anim-content { opacity: 0; }
  }
}

.list-container {
  grid-template-columns: 0fr;
  .grid-anim-content { opacity: 0; }
  &.is-expanded {
    grid-template-columns: 1fr;
    .grid-anim-content { opacity: 1; }
  }
}

/* --- 內部元素樣式 --- */
.version-display {
  color: v.$white;
  white-space: nowrap;
  transition: color 0.3s ease;

  &.is-choosed {
    color: v.$vieshow-primary; // 選中非預設值時變為藍色
  }
}

.version-list {
  flex-wrap: nowrap !important;
  gap: var(--gap-md); 
  white-space: nowrap;
}

.version-item {
  color: v.$white;
  transition: color 0.2s ease;
  flex-shrink: 0;

  &.is-active {
    color: v.$vieshow-primary;
  }

  @include hover-focus {
    color: v.$vieshow-primary;
  }
}

.fa-angle-right {
  color: v.$white;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &.is-choosed {
    color: v.$vieshow-primary;
  }

  &.is-expanded {
    transform: rotate(180deg);
  }
}
</style>