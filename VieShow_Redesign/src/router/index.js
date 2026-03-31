import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ... 這裡可能已經有你首頁的設定 ...
    
    // 👇 新增這一段給註冊頁面
    {
      // 1. path 是「網址」。請用斜線開頭，取一個乾淨好記的英文單字。
      path: '/signup', 
      // 2. name 是「代號」。方便你在程式碼裡用 router.push({ name: 'SignUp' }) 跳轉。
      name: 'SignUp',  
      // 3. component 是「檔案位置」。這行你原本就寫對了！保留！
      component: () => import('@/components/Auth/SignUpSelection.vue')
    }
  ]
})

export default router