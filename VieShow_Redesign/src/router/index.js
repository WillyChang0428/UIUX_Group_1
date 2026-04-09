import { createRouter, createWebHistory } from "vue-router";

// 💡 1. 引入您的三種 Layout 外殼
import DefaultLayout from "@/components/Layout/DefaultLayout.vue";
import BookingLayout from "@/components/Layout/BookingLayout.vue";
import SignUpLayout from "@/components/Layout/SignUpLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ==========================================
    // 🟢 型態一：預設佈局 (一般 Header + Footer)
    // 適用：首頁、電影資訊、影城據點等
    // ==========================================
    {
      path: "/",
      component: DefaultLayout, // 父層指定為 DefaultLayout
      children: [
        { 
          path: "", 
          component: () => import("@/views/HomePage.vue") 
        },
        { 
          path: "moviesdetail", 
          component: () => import("@/views/MovieInfo/MovieDetail.vue") 
        },
        { 
          path: "fastbooking", 
          component: () => import("@/views/Booking/FastBooking.vue") 
        },
        // // 💡 假設「某個特定頁面」用這個 Layout 但【不要 Footer】，可以加上 meta
        // {
        //   path: "nofooter-page",
        //   component: () => import("@/views/SomePage.vue"),
        //   meta: { hideFooter: true } // 加上這個標籤
        // }
      ]
    },

    // ==========================================
    // 🔵 型態二：訂票佈局 (訂票專用 Header + 訂票專用Footer)
    // 適用：快速訂票、選位、結帳等
    // ==========================================
    {
      path: "/booking",
      component: BookingLayout,
      children: [
        { 
          path: "ticket", 
          component: () => import("@/views/Booking/TicketBooking.vue")  //  /booking/ticket
        },
      ]
    },

    // ==========================================
    // 🟣 型態三：註冊佈局 (註冊專用 Header + 無 Footer)
    // 適用：註冊流程
    // ==========================================
    {
      path: "/auth",
      component: SignUpLayout,
      children: [
        // 範例：路徑會變成 /auth/signup
        // { 
        //   path: "signup", 
        //   component: () => import("@/views/SignUp/SignUpPage.vue") 
        // }
      ]
    }
  ],
});

export default router;