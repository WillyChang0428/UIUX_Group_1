<script setup>
import Calendar from '@/components/Common/InputBox/Calendar.vue';
import { ref } from 'vue';

// 🌟 這裡就是 myBirthday 定義的地方！
const myBirthday = ref(null);
</script>

<template>
<Calendar v-model="myBirthday" />
</template>
