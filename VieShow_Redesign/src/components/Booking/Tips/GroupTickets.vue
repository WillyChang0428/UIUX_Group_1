<template>
  <BaseModal v-model="isOpen" type="base">
    <template #title>團體票</template>
    <template #content>
      <p class="ticket-info__text">
        此票種為提供已有實體團體票券客人預訂座位使用。需電影開演前 30 分至櫃台取票；如未取票，座位將自動取消。
      </p>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '@/components/Common/Button/BaseModal.vue'

const props  = defineProps({ modelValue: { type: Boolean, required: true } })
const emit   = defineEmits(['update:modelValue'])
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

// 本體文字：輔助文 Sm，手機 14px / PC 16px 自動縮放
.ticket-info__text {
  margin: 0;
  // 手冊字體：Sm 等級
  font-size: var(--app-font-size-sm);
  // 手冊顏色：語意化，不寫色碼
  color: rgba(v.$white, 0.85);
  // 手冊行高：Body Default
  line-height: 1.7;
  letter-spacing: 0.02em;
}
</style>