<template>
  <li class="category-item list-unstyled" ref="itemRef">
    <div
      class="category-header d-flex justify-content-between align-items-center py-2"
      @click.stop="toggleExpand"
    >
      <span class="fw-medium">{{ label }}</span>
      <i
        :class="[
          isExpanded ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down',
          'icon-sm',
        ]"
      ></i>
    </div>

    <Transition name="expand">
      <ul v-if="isExpanded" class="sub-options list-unstyled m-0">
        <slot></slot>
      </ul>
    </Transition>
  </li>
</template>

<script setup>
// ... 原本的 Logic 保持不變 ...
import { ref, nextTick } from "vue";

const props = defineProps({
  label: String,
});

const isExpanded = ref(false);
const itemRef = ref(null);

const toggleExpand = async () => {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    await nextTick();
    setTimeout(() => {
      const element = itemRef.value;
      const container = element.closest(".options-list");
      if (container && element) {
        const elementTop = element.getBoundingClientRect().top;
        const containerTop = container.getBoundingClientRect().top;
        const currentScroll = container.scrollTop;
        const targetPos = elementTop - containerTop + currentScroll;
        container.scrollTo({
          top: targetPos,
          behavior: "smooth",
        });
      }
    }, 100);
  }
};
</script>

<style scoped lang="scss">
.category-item {
  .category-header {
    // 💡 呼叫等級三 SCSS 變數，確保文字顏色對齊品牌標籤 [cite: 95, 125]
    color: v.$white;
    cursor: pointer;
    transition: background 0.3s;

    // 💡 字體大小自動縮放：手機 16px / 電腦 18px
    font-size: var(--app-font-size-base);
  }

  .sub-options {
    // 💡 呼叫等級二 CSS 變數：間距自動縮放 (手機 16px / 電腦 32px)
    padding-left: var(--gap-md);
    overflow: hidden;

    :deep(li) {
      // 💡 使用手冊規範的子項目間距 [cite: 111, 131]
      padding: var(--gap-sm) var(--gap-md);

      // 💡 字體使用 Sm 等級：手機 14px / 電腦 16px
      font-size: var(--app-font-size-sm);
      color: v.$vieshow-secondary;

      &:hover {
        color: v.$vieshow-primary;
      }
    }
  }
}

/* 💡 動態過渡效果維持 CSS (指南允許非標準動畫) [cite: 127] */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-out;
  max-height: 500px;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
</style>
