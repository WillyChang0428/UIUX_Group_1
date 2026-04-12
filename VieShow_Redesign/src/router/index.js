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
          path: "movieinfo", 
          component: () => import("@/views/MovieInfo/MovieInfo.vue") 
        },
        { 
          path: "fastbooking", 
          component: () => import("@/views/Booking/FastBooking.vue") 
        },
        { 
          path: "final", 
          component: () => import("@/views/Booking/Step/Final.vue")  //  /booking/ticket
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
          component: () => import("@/views/Booking/Step/TicketBooking.vue")  //  /booking/ticket
        },
        { 
          path: "receipt", 
          component: () => import("@/views/Booking/Step/Receipt.vue")  //  /booking/ticket
        },
        { 
          path: "paying", 
          component: () => import("@/views/Booking/Step/Paying.vue")  //  /booking/ticket
        },
        { 
          path: "seat", 
          component: () => import("@/views/Booking/Step/SeatSelecter.vue")  //  /booking/ticket
        },
        { 
          path: "food", 
          component: () => import("@/views/Booking/Step/FoodAddOn.vue")  //  /booking/ticket
        },
        
      ]
    },

    // ==========================================
    // 🟣 型態三：註冊佈局 (註冊專用 Header + 無 Footer)
    // 適用：註冊流程
    // ==========================================
    {
      path: "/SignUp",
      component: () => import("@/components/Layout/SignUpLayout.vue"),
      redirect: '/SignUp/SignUpStep1',
      children: [
        { 
          path: "SignUpStep1", 
          component: () => import("@/views/SignUp/SignUpStep1.vue") 
        },
        { 
          path: "SignUpStep2", 
          component: () => import("@/views/SignUp/SignUpStep2.vue") 
        },
        { 
          path: "SignUpStep3", 
          component: () => import("@/views/SignUp/SignUpStep3.vue") 
        },
        { 
          path: "SignUpStep4", 
          component: () => import("@/views/SignUp/SignUpStep4.vue") 
        },
        { 
          path: "SignUpStep5", 
          component: () => import("@/views/SignUp/SignUpStep5.vue") 
        }
      ]
    }
  ],
});

export default router;