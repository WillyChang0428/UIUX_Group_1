import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // ══════════════════════════════════════════════════════════════
  // 1. 模擬會員資料庫 (假資料，實戰中會存在後端資料庫)
  // ══════════════════════════════════════════════════════════════
  const userList = ref([
    {
      id: "U001",
      realName: "王大明",
      email: "wang123@gmail.com", // 帳號 (電子信箱)
      password: "Password123", // 密碼
      idNumber: "A123456789", // 身分證字號
      phone: "0912345678", // 手機號碼
      isGoogleLinked: true, // 是否綁定 Google
      linkedGoogleEmail: "a2492257@gmail.com", // 已綁定的 Google 信箱
      walletBalance: 1500, // 💰 新增：錢包餘額 (預設 1500)
    },
    {
      id: "U002",
      realName: "林小華",
      email: "lin_flower@yahoo.com.tw",
      password: "Flower456",
      idNumber: "B234567890",
      phone: "0923456789",
      isGoogleLinked: false,
      linkedGoogleEmail: null, // 未綁定則為 null
      walletBalance: 0, // 💰 新增：錢包餘額 (預設 0)
    },
    {
      id: "U003",
      realName: "陳美麗",
      email: "beautiful_chen@hotmail.com",
      password: "Meili789",
      idNumber: "C345678901",
      phone: "0934567890",
      isGoogleLinked: true,
      linkedGoogleEmail: "beautiful_chen@hotmail.com", // 可以跟註冊信箱一樣
      walletBalance: 500, // 💰 新增：錢包餘額 (預設 500)
    },
    {
      id: "U004",
      realName: "張建國",
      email: "jianguo_zhang@company.com.tw",
      password: "BuildNation001",
      idNumber: "D456789012",
      phone: "0945678901",
      isGoogleLinked: false,
      linkedGoogleEmail: "", // 空字串也可以代表未綁定
      walletBalance: 3200, // 💰 新增：錢包餘額 (預設 3200)
    },
    {
      id: "U005",
      realName: "李雅婷",
      email: "yating_lee99@gmail.com",
      password: "Yating2026",
      idNumber: "E567890123",
      phone: "0956789012",
      isGoogleLinked: true,
      linkedGoogleEmail: "yating.lee.work@gmail.com",
      walletBalance: 120, // 💰 新增：錢包餘額 (預設 120)
    },
  ]);

  // ══════════════════════════════════════════════════════════════
  // 2. 登入狀態管理
  // ══════════════════════════════════════════════════════════════

  // 當前登入的會員 (若為 null 代表未登入)
  const currentUser = ref(null); // 預設為第一個會員，實際使用時可改為 null

  // 判斷是否已登入的 computed (供 Navbar 或 Route Guard 使用)
  const isLoggedIn = computed(() => currentUser.value !== null);

  // ══════════════════════════════════════════════════════════════
  // 3. Actions (提供給組件呼叫的方法)
  // ══════════════════════════════════════════════════════════════

  /**
   * 一般帳號密碼登入
   * @param {String} email 輸入的信箱
   * @param {String} password 輸入的密碼
   * @returns {Boolean} 登入是否成功
   */
  const login = (email, password) => {
    const user = userList.value.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      currentUser.value = user;
      return true; // 登入成功
    }
    return false; // 登入失敗 (帳號或密碼錯誤)
  };

  /**
   * 模擬 Google 快速登入
   * @param {String} googleEmail Google 授權回傳的信箱
   */
  const loginWithGoogle = (googleEmail) => {
    const user = userList.value.find(
      (u) => u.isGoogleLinked && u.linkedGoogleEmail === googleEmail,
    );

    if (user) {
      currentUser.value = user;
      return true;
    }
    return false; // 找不到綁定此 Google 信箱的帳號
  };

  /**
   * 登出
   */
  const logout = () => {
    currentUser.value = null;
  };

  return {
    // State
    userList,
    currentUser,
    // Computed
    isLoggedIn,
    // Actions
    login,
    loginWithGoogle,
    logout,
  };
});
