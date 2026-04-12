<script setup>
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '標籤' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  hideLabel: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'blur']);
</script>

<template>
  <div class="metadata-input-wrapper d-flex align-items-center w-100 border rounded-lg bg-dark-section overflow-hidden">
    
    <div v-if="!hideLabel" class="label-box px-3 h-100 d-flex align-items-center justify-content-center">
      <span class="text-tertiary fs-6 fw-medium text-nowrap">{{ label }}</span>
    </div>

    <input
      :type="type"
      :value="modelValue"
      @input="e => emit('update:modelValue', e.target.value)"
      @blur="emit('blur')"
      :placeholder="placeholder"
      class="flex-grow-1 bg-transparent border-0 text-white px-3 shadow-none h-100"
    />
  </div>
</template>

<style lang="scss" scoped>
.metadata-input-wrapper {
  height: 48px;
  opacity: 0.7;
  border: 1px solid rgba(v.$light, 0.5) !important; 
  transition: all 0.3s ease; 

  &:focus-within {
    opacity: 1;
    border-color: v.$light !important;
    box-shadow: 0 0 25px rgba(v.$light, 0.2);

    // 🌟 讓中間那條線在 focus 時變亮
    .label-box::after {
      background-color: rgba(v.$light, 0.5);
    }
  }
}

.label-box {
  min-width: 100px;
  height: 100%;
  position: relative; 

  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 1px;
    background-color: rgba(v.$light, 0.2); // 預設暗色
    transition: background-color 0.3s ease;
  }
}


input::placeholder {
  color: var(--bs-secondary) !important;
  opacity: 1;
}
</style>