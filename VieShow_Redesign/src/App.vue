<script setup>
import { ref } from 'vue';
// 1. 引入剛剛做好的 InputBox
import MetadataInput from './components/Common/InputBox/MetadataInput.vue';
</script>

<template>
    <div class="mb-4">
      <label class="text-white mb-2 d-block">請輸入您的電子信箱</label>
      
      <MetadataInput 
        v-model="userEmail" 
        placeholder="例如：abc@gmail.com"
        type="password"
      />
      
      <p class="text-white-50 mt-2">
        目前的輸入內容：{{ userEmail }}
      </p>
    </div>
</template>



<style lang="scss" scoped>

</style>
