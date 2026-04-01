<template>
  
</template>

<script setup>


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



<style lang="scss" scoped>

</style>
