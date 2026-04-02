<template>
<div class="metadata-input-wrapper d-flex align-items-center w-100 border rounded-lg bg-dark-section overflow-hidden">
    <input
      :type="type"
      :value="modelValue"
      @input="e => emit('update:modelValue', e.target.value)"
      :placeholder="placeholder"
      class="flex-grow-1 bg-transparent border-0 text-white px-3 shadow-none h-100"
    />
  </div>
</template>


<script setup>
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' }
});


const emit = defineEmits(['update:modelValue']);
</script>


<style lang="scss" scoped>
.metadata-input-wrapper {
  height: 48px;
  transition: opacity 0.3s ease, border-color 0.3s ease;
  opacity: 0.7;


  border: 1px solid rgba(v.$light, 0.7) !important;


  &:focus-within {
    opacity: 1;                      // 整體變為不透明
    border-color: v.$light !important; // 邊框變為純白
    box-shadow: 0 0 25px rgba(v.$light, 0.2); // 額外加一點微光，更有質感
  }
}


.label-box {
  min-width: 100px; // 確保標籤寬度一致
}


input::placeholder {
  color: var(--bs-secondary) !important;
  opacity: 0.7;
}
</style>
