<script setup>
import SignUpStart from '@/components/Auth/SignUpStart.vue';
import SecondaryButton from '@/components/Common/Button/SecondaryButton.vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isAgreed = ref(false);

const handleNext = () => {
  if (!isAgreed.value) return; // 雙重防呆
  console.log("同意條款，準備前往下一步！");
  // router.push('/next-step'); 
};
</script>

<template>
  <div class="container d-flex flex-column justify-content-center align-items-center gap-3 ">
    <img src="@/assets/images/Member1.png" class="d-none d-md-block rounded">
    <img src="@/assets/images/Member2.png" class="d-md-none rounded">
    <div class="outer-wrapper border border-light rounded p-3 w-100">
      <div class="inner-scroll-box">
        <SignUpStart></SignUpStart>
      </div>
    </div>
    <div class="w-100 d-flex flex-column gap-3 mt-1">
        
        <label class="custom-checkbox d-flex align-items-center gap-2 m-0 px-1">
          <input type="checkbox" v-model="isAgreed" class="d-none" />
          
          <div class="checkbox-box d-flex justify-content-center align-items-center rounded">
            <i class="fa-solid fa-check check-icon" :class="{ 'is-active': isAgreed }"></i>
          </div>
          
          <span class="text-light fs-6 select-none">我已詳細閱讀並完全同意上述條款</span>
        </label>

        <SecondaryButton 
          class="w-100 py-2 my-3"
          :is-disabled="!isAgreed" 
          @click="handleNext"
        >
          下一步
        </SecondaryButton>

      </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/variables"; // 💡 確保引入地基

html, body , #app {
  height: 100vh;
  background: v.$vieshow-gradient-dark;
}

img{
  max-width: 100%;
  height: auto;
}


/* --- 外層容器：只管背景和白線邊框 --- */
.outer-wrapper {
  background: rgba(v.$black, 0.3);
  border-color: rgba(v.$light, 0.2) !important;
}

/* --- 內層容器：負責高度與所有捲軸行為 --- */
.inner-scroll-box {
  height: 30vh; // 🌟 高度限制移到這裡，讓藍框固定高度
  overflow-y: auto; // 🌟 捲軸只在這裡產生
  overflow-x: hidden;
  
  /* 客製化捲軸 (現在只會依附在藍線上) */
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(v.$light, 0.3);
    border-radius: 10px;
    
    &:hover {
      background-color: rgba(v.$light, 0.5);
    }
  }
}

.custom-checkbox {
  cursor: pointer;
  user-select: none; // 防止連點時文字反白
  
  .checkbox-box {
    width: 22px;
    height: 22px;
    border: 2px solid rgba(v.$light, 0.5);
    transition: all 0.2s ease;
    
    .check-icon {
      color: v.$vieshow-dark; // 打勾的顏色用深色比較明顯
      font-size: 14px;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      
      &.is-active {
        opacity: 1;
        transform: scale(1); // 加上彈出動畫
      }
    }
  }

  /* 當隱藏的 input 被勾選時，改變我們畫的框框 */
  input:checked + .checkbox-box {
    background-color: v.$vieshow-primary;
    border-color: v.$vieshow-primary;
  }
}
</style>
