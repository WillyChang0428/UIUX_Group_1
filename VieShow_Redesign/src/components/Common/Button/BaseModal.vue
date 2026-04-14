<!-- 樣式引用
 樣式 1 & 2：基本款與危險款
<BaseModal v-model="isOpen" type="base">
  <template #title>領取成功</template>
  <template #content>您的優待票券已存入票夾。</template>
</BaseModal>

<BaseModal v-model="isDeleteOpen" type="danger">
  <template #title>確認刪除</template>
  <template #content>確定要刪除此筆訂單嗎？此動作無法復原。</template>
</BaseModal>


樣式 3：長文字說明（自動帶捲軸）
<BaseModal v-model="isRuleOpen" type="scroll">
  <template #title>使用須知</template>
  <template #content>
    <p>1. 學生身分請出示有效學生證...</p>
    <p>2. 軍警身分...</p>
    </template>
</BaseModal>

樣式 4：自動關閉提示 (Toast)
<BaseModal v-model="isToastOpen" type="toast" :duration="2000">
  <template #content>已儲存至我的收藏</template>
</BaseModal>


Props:
v-model: 控制開啟/關閉（必填）。
type: 字串，可選 base | danger | scroll | toast。
duration: 數字，僅在 toast 模式有效（預設 3000）。

Slots:
#title: 彈窗標題文字。
#content: 彈窗主體內容，支援純文字或 HTML。
-->

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="modal-overlay d-flex justify-content-center"
        :class="[
          type === 'toast' ? 'align-items-start pt-5' : 'align-items-center',
        ]"
        @click.self="type !== 'toast' && close()"
      >
        <div
          class="modal-container shadow-lg p-4"
          :class="{
            'border-danger': type === 'danger',
            'toast-style': type === 'toast',
          }"
        >
          <div
            v-if="type !== 'toast'"
            class="modal-header d-flex justify-content-between align-items-center border-0 mb-3 p-0"
          >
            <h4
              class="modal-title h4 mb-0 fw-medium"
              :class="{ 'text-danger': type === 'danger' }"
            >
              <slot name="title">標題</slot>
            </h4>

            <button
              type="button"
              class="close-btn border-0 bg-transparent p-2"
              @click="close"
              aria-label="Close"
            >
              <i class="fa-solid fa-xmark icon-md text-white"></i>
            </button>
          </div>

          <div class="modal-body p-0">
            <div
              class="modal-text"
              :class="[type === 'scroll' ? 'scroll-mode' : 'fs-sm']"
            >
              <slot name="content">此為預設警示說明內容。</slot>
            </div>
          </div>
          <div
            v-if="$slots.footer && type !== 'toast'"
            class="modal-footer border-0 p-0 mt-4"
          >
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  // 樣式類型：'base' (基本), 'danger' (危險), 'scroll' (長文字), 'toast' (自動關閉提示)
  type: { type: String, default: "base" },
  // 自動關閉時間 (毫秒)
  duration: { type: Number, default: 3000 },
});

const emit = defineEmits(["update:modelValue"]);

const close = () => {
  emit("update:modelValue", false);
};

// 處理模式 4：自動關閉邏輯
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && props.type === "toast") {
      setTimeout(() => {
        close();
      }, props.duration);
    }
  },
);
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba($black, 0.6);
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-container {
  width: fit-content;
  max-width: 300px;
  background: rgba($white, 0.1);
  border: 2px solid rgba($white, 0.2);
  border-radius: $border-radius-pc;
  backdrop-filter: blur(20px) saturate(180%);
  color: $white;
  word-break: break-word;

  @include media-breakpoint-up(md) {
    max-width: 480px;
  }
  background: rgba($white, 0.1);

  &.border-danger {
    border-color: rgba($vieshow-danger, 0.5) !important;
  }

  &.toast-style {
    width: auto;
    min-width: 200px;
    background: rgba($vieshow-dark, 0.8);
    border: 1px solid $vieshow-primary;
    text-align: center;
  }
}

.scroll-mode {
  max-height: 250px; // 模式 3：限制內容高度
  overflow-y: auto;
  font-size: $font-size-sm-pc;
  padding-right: 8px;

  /* 客製化捲軸樣式 */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba($white, 0.3);
    border-radius: 10px;
  }
}

.modal-title {
  letter-spacing: $letter-spacing-wide;
}
.text-danger {
  color: $vieshow-danger !important;
}

.btn-vieshow-primary {
  background: $vieshow-gradient-primary;
  color: $white;
  border-radius: $btn-border-radius;
}

// 動態效果
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
