<template>
  <div 
    class="ticket-status-tag d-inline-block px-2 py-1 rounded-xl font-size-mini fw-bold"
    :class="statusClass"
  >
    {{ statusText }}
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 狀態傳入：'active' (有效), 'pending' (無效/待處理), 'expired' (失效)
  status: {
    type: String,
    default: 'active',
    validator: (value) => ['active', 'pending', 'expired'].includes(value)
  }
});

// 根據手冊規範，對應不同的狀態文字
const statusText = computed(() => {
  const map = {
    active: '有效票券',
    pending: '待處理', // 參考圖示中的無效/灰色狀態
    expired: '已失效'
  };
  return map[props.status];
});

// 動態綁定樣式類別
const statusClass = computed(() => {
  return {
    'status-active': props.status === 'active',
    'status-pending': props.status === 'pending',
    'status-expired': props.status === 'expired'
  };
});
</script>

<style scoped lang="scss">
.ticket-status-tag {
  letter-spacing: 1px;
  white-space: nowrap;
  /* 統一文字顏色為白色，符合設計稿 */
  color: #FFFFFF; 
}

/* 狀態色彩調用 - 嚴格遵守手冊變數 */
.status-active {
  background-color: var(--vieshow-success, #4BB85B); /* 手冊 Success: #4BB85B */
}

.status-pending {
  background-color: var(--secondary-emphasis, #4A4A4A); /* 手冊 Secondary Emp: #4A4A4A */
}

.status-expired {
  background-color: var(--vieshow-danger, #ED3F20); /* 手冊 Danger: #ED3F20 */
}
</style>