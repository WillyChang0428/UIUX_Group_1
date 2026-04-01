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
  <FlatSelect :isOpen="isOpen" :isSelected="isSelected" :placeholder="selectedValue || '預設提示文字'"
    @toggle="isOpen = !isOpen" @clear="selectedValue = ''; isSelected = false">
    <template #options>
      <li @click="handleSelect('選項 A')">選項 A</li>
      <li @click="handleSelect('選項 B')">選項 B</li>
      <SelectCategory label="雙北">
        <li @click="handleSelect('選項 A')">選項 A</li>
        <li @click="handleSelect('選項 B')">選項 B</li>
        <li @click="handleSelect('選項 B')">選項 B</li>
        <li @click="handleSelect('選項 B')">選項 B</li>
        <li @click="handleSelect('選項 B')">選項 B</li>
      </SelectCategory>
      <SelectCategory label="桃竹苗">
        <li @click="handleSelect('選項 A')">選項 A</li>
        <li @click="handleSelect('選項 B')">選項 B</li>
        <li @click="handleSelect('選項 B')">選項 B</li>
        <li @click="handleSelect('選項 B')">選項 B</li>
        <li @click="handleSelect('選項 B')">選項 B</li>
      </SelectCategory>
    </template>
  </FlatSelect>
</template>

<style lang="scss">
/* 你的全域樣式 */
body {
  height: 100vh;
  background: v.$vieshow-gradient-dark;
  padding: 133px 0 0;
  /* 預留 Header 的高度 */
}
</style>
