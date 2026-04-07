<template>
  <div
    class="area-selector d-inline-flex align-items-center"
    @click="toggleExpand"
  >
    <div
      class="grid-anim-container label-container"
      :class="{ 'is-hidden': isExpanded }"
    >
      <div class="grid-anim-content d-flex align-items-center">
        <div class="region-display is-choosed fw-bold">
          {{ currentRegionLabel }}
        </div>
      </div>
    </div>

    <div
      class="grid-anim-container list-container"
      :class="{ 'is-expanded': isExpanded }"
    >
      <div class="grid-anim-content d-flex align-items-center">
        <div class="region-list d-flex align-items-center">
          <span
            v-for="region in cinemaStore.cinemaList"
            :key="region.id"
            class="region-item fw-bold"
            :class="{ 'is-active': modelValue === region.id }"
            @click.stop="selectRegion(region.id)"
          >
            {{ region.label }}
          </span>
        </div>
      </div>
    </div>

    <i
      class="fa-solid fa-angle-right ms-2 icon-sm"
      :class="{ 'is-expanded': isExpanded }"
    ></i>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCinemaStore } from "@/store/cinema";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);
const cinemaStore = useCinemaStore();
const isExpanded = ref(false);

const currentRegionLabel = computed(() => {
  const region = cinemaStore.cinemaList.find((r) => r.id === props.modelValue);
  return region ? region.label : "";
});

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const selectRegion = (id) => {
  emit("update:modelValue", id);
  emit("change", id);
  isExpanded.value = false;
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables";

.area-selector {
  cursor: pointer;
  font-size: var(--app-font-size-base);
  user-select: none;
  min-height: 45px;
}

/* ===================================================
   💡 終極解法：CSS Grid 動態寬度 (完美解決跳動)
   原理：利用 grid-template-columns 在 0fr 與 1fr 間過渡，
   由瀏覽器精準計算真實寬度，徹底擺脫 max-width 的限制，
   並且不需要插入/移除 DOM，完全消除跳動閃爍！
   =================================================== */

.grid-anim-container {
  display: grid;
  // 💡 動畫曲線對齊全站規範，0.4s 緩進緩出
  transition: grid-template-columns 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.grid-anim-content {
  min-width: 0; // 💡 CSS Grid 動畫必須屬性，防止內容撐破容器
  overflow: hidden; // 隱藏縮小時的溢出內容
  transition: opacity 0.3s ease;
}

/* --- 收合狀態下的「當前區域文字」 --- */
.label-container {
  grid-template-columns: 1fr; // 預設撐開至文字實際寬度

  &.is-hidden {
    grid-template-columns: 0fr; // 點擊後，寬度精準縮為 0

    .grid-anim-content {
      opacity: 0; // 同步淡出
    }
  }
}

/* --- 展開狀態下的「區域列表」 --- */
.list-container {
  grid-template-columns: 0fr; // 預設寬度為 0

  .grid-anim-content {
    opacity: 0;
  }

  &.is-expanded {
    grid-template-columns: 1fr; // 點擊後，完美撐開至列表的實際總寬度

    .grid-anim-content {
      opacity: 1; // 同步淡入
    }
  }
}

/* ===================================================
   基礎元素樣式設定
   =================================================== */

.region-display {
  color: v.$vieshow-primary;
  white-space: nowrap; // 絕對不能換行
}

.region-list {
  flex-wrap: nowrap !important;
  gap: var(--gap-md);
  white-space: nowrap; // 絕對不能換行
}

.region-item {
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
  color: v.$vieshow-primary;
  // 箭頭旋轉時間與 Grid 展開時間保持一致
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &.is-expanded {
    transform: rotate(180deg);
  }
}
</style>
