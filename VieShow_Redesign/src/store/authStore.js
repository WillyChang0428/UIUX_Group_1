import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // ══════════════════════════════════════════════════════════════
  // 1. 狀態定義 (State)
  // ══════════════════════════════════════════════════════════════
  const userList = ref([
    {
      id: "U001",
      realName: "王大明",
      email: "wang123@gmail.com",
      password: "Password123",
      idNumber: "A123456789",
      phone: "0912345678",
      isGoogleLinked: true,
      linkedGoogleEmail: "wang123@gmail.com",
      walletBalance: 1500
    },
    {
      id: "U002",
      realName: "林小華",
      email: "lin_flower@yahoo.com.tw",
      password: "Flower456",
      idNumber: "B234567890",
      phone: "0923456789",
      isGoogleLinked: false,
      linkedGoogleEmail: null,
      walletBalance: 0
    },
    {
      id: "U003",
      realName: "陳美麗",
      email: "beautiful_chen@hotmail.com",
      password: "Meili789",
      idNumber: "C345678901",
      phone: "0934567890",
      isGoogleLinked: true,
      linkedGoogleEmail: "beautiful_chen@hotmail.com",
      walletBalance: 500
    },
    {
      id: "U004",
      realName: "張建國",
      email: "jianguo_zhang@company.com.tw",
      password: "BuildNation001",
      idNumber: "D456789012",
      phone: "0945678901",
      isGoogleLinked: false,
      linkedGoogleEmail: "",
      walletBalance: 3200
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
      walletBalance: 120
    }
  ]);

  const pendingUser = ref({
    email: "",
    password: "",
    realName: "",
    idNumber: "",
    phone: "",
    birthday: null,
    isGoogleLinked: false,
    linkedGoogleEmail: ""
  });

  const currentUser = ref(null);

  // ══════════════════════════════════════════════════════════════
  // 2. 計算屬性 (Getters)
  // ══════════════════════════════════════════════════════════════
  const isLoggedIn = computed(() => currentUser.value !== null);

  // ══════════════════════════════════════════════════════════════
  // 3. 動作 (Actions)
  // ══════════════════════════════════════════════════════════════
  
  const resetPendingUser = () => {
    pendingUser.value = {
      email: "",
      password: "",
      realName: "",
      idNumber: "",
      phone: "",
      birthday: null,
      isGoogleLinked: false,
      linkedGoogleEmail: ""
    };
    console.log("🧹 註冊暫存區已清空");
  };

  const generateNextId = () => {
    if (userList.value.length === 0) return "U001";
    const lastUser = userList.value[userList.value.length - 1];
    const nextNum = parseInt(lastUser.id.replace("U", "")) + 1;
    return `U${nextNum.toString().padStart(3, "0")}`;
  };

  /**
   * 🌟 處理 Google 登入與註冊判定
   * 這是實現「真正登入」的核心：
   * 1. 如果信箱已存在，執行「登入」動作 (更新 currentUser)
   * 2. 如果信箱不存在，執行「準備註冊」動作 (更新 pendingUser)
   */
  const startGoogleRegistration = (googleEmail) => {
    if (!googleEmail) {
      console.error("❌ Google Email 為空");
      return { action: 'error', message: '無法取得信箱' };
    }

    // 檢查 Google 信箱是否已存在於名單中 (交叉檢查一般信箱與 Google 綁定信箱)
    const existingUser = userList.value.find(u => {
      const matchGoogle = u.linkedGoogleEmail && u.linkedGoogleEmail === googleEmail;
      const matchAccount = u.email && u.email === googleEmail;
      return matchGoogle || matchAccount;
    });

    if (existingUser) {
      // ✅ 老會員：直接執行登入
      currentUser.value = existingUser;
      console.log("✅ [Google 登入成功] 歡迎回來：", existingUser.realName);
      return { action: 'login', user: existingUser }; 
    }

    // 🆕 新用戶：將資料推送到暫存區，準備進入註冊流程
    pendingUser.value.email = googleEmail;
    pendingUser.value.linkedGoogleEmail = googleEmail;
    pendingUser.value.isGoogleLinked = true;
    pendingUser.value.password = "GOOGLE_OAUTH_ACCOUNT";
    
    console.log("🚩 [Google 新用戶] 資料已存入暫存區，引導至註冊");
    return { action: 'register' };
  };

  const completeRegistration = () => {
    const newUser = {
      id: generateNextId(),
      ...pendingUser.value,
      walletBalance: 0 
    };
    
    userList.value.push(newUser);
    currentUser.value = newUser; 

    console.log("🎉 新會員註冊成功！", newUser);
    resetPendingUser(); 
  };

  const login = (email, password) => {
    const user = userList.value.find(u => u.email === email && u.password === password);
    if (user) {
      currentUser.value = user;
      console.log("✅ [帳號登入成功] 歡迎：", user.realName);
      return true;
    }
    return false;
  };

  const logout = () => {
    currentUser.value = null;
    resetPendingUser();
    console.log("👋 已成功登出");
  };

  /**
   * 🌟 跨分頁狀態同步
   */
  const initSync = () => {
    window.addEventListener('storage', (event) => {
      if (event.key === 'auth') {
        try {
          const newState = JSON.parse(event.newValue);
          if (!newState) return;

          // 🌟 防止死循環關鍵：比對 ID 或內容，如果跟現在一樣，就不要動！
          // 比對 currentUser
          const newId = newState.currentUser?.id || null;
          const currentId = currentUser.value?.id || null;

          if (newId !== currentId) {
            console.log("🔄 [同步] 偵測到用戶狀態不同，執行更新");
            currentUser.value = newState.currentUser;
          }

          // 比對 userList 長度，如果不等才更新（簡單判斷）
          if (newState.userList && newState.userList.length !== userList.value.length) {
            console.log("🔄 [同步] 偵測到名單長度不同，更新名單");
            userList.value = newState.userList;
          }

        } catch (e) {
          console.error("❌ 同步解析失敗", e);
        }
      }
    });
  };

  // 初始化執行監聽
  initSync();

  return {
    userList, currentUser, pendingUser,
    isLoggedIn,
    login, logout,
    startGoogleRegistration, completeRegistration, resetPendingUser
  };
}, {
  persist: true
});