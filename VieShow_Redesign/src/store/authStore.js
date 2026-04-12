import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // ══════════════════════════════════════════════════════════════
  // 1. 模擬會員資料庫 (假資料，實戰中會存在後端資料庫)
  // ══════════════════════════════════════════════════════════════
  const userList = ref(
    [
      {
        id: "U001",
        realName: "王大明",
        email: "wang123@gmail.com", // 帳號 (電子信箱)
        password: "Password123",    // 密碼
        idNumber: "A123456789",     // 身分證字號
        phone: "0912345678",        // 手機號碼
        isGoogleLinked: true,       // 是否綁定 Google
        linkedGoogleEmail: "wang123@gmail.com", // 已綁定的 Google 信箱
        walletBalance: 1500         // 💰 新增：錢包餘額 (預設 1500)
      },
      {
        id: "U002",
        realName: "林小華",
        email: "lin_flower@yahoo.com.tw",
        password: "Flower456",
        idNumber: "B234567890",
        phone: "0923456789",
        isGoogleLinked: false,
        linkedGoogleEmail: null,    // 未綁定則為 null
        walletBalance: 0            // 💰 新增：錢包餘額 (預設 0)
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
        walletBalance: 500          // 💰 新增：錢包餘額 (預設 500)
      },
      {
        id: "U004",
        realName: "張建國",
        email: "jianguo_zhang@company.com.tw",
        password: "BuildNation001",
        idNumber: "D456789012",
        phone: "0945678901",
        isGoogleLinked: false,
        linkedGoogleEmail: "",      // 空字串也可以代表未綁定
        walletBalance: 3200         // 💰 新增：錢包餘額 (預設 3200)
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
        walletBalance: 120          // 💰 新增：錢包餘額 (預設 120)
      }
    ]
  );

  //註冊資料存入
  // 1. 註冊暫存區 (跨步驟表單共用的空白表單)
  const pendingUser = ref({
    email: "",
    password: "",
    realName: "",
    idNumber: "",
    phone: "",
    birthday: null, // 建議加上生日
    isGoogleLinked: false,
    linkedGoogleEmail: ""
  });

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

  // ══════════════════════════════════════════════════════════════
  // 2. 核心邏輯修改：處理 Google 註冊/檢查
  // ══════════════════════════════════════════════════════════════
  const startGoogleRegistration = (googleEmail) => {
    // 🌟 核心防錯：如果傳入空值，直接視為新用戶或報錯，不進行比對
    if (!googleEmail) {
      console.error("❌ Google Email 為空，無法檢查");
      return { action: 'register' };
    }

    // 🌟 核心修正：增加「必須有值」的判斷 (避免 null === null 的誤判)
    const existingUser = userList.value.find(u => {
      const matchGoogle = u.linkedGoogleEmail && u.linkedGoogleEmail === googleEmail;
      const matchAccount = u.email && u.email === googleEmail;
      return matchGoogle || matchAccount; // 只要其中一個信箱對上，就代表註冊過了
    });

    if (existingUser) {
      console.log("🚩 偵測到已註冊用戶，準備執行登入");
      currentUser.value = existingUser; // 老客戶直接幫他登入
      return { action: 'login' }; 
    }

    // ✅ 新用戶：資料自動推送到暫存區
    console.log("🚩 新用戶，將 Email 存入暫存區並前往 Step 3");
    pendingUser.value.email = googleEmail;
    pendingUser.value.linkedGoogleEmail = googleEmail;
    pendingUser.value.isGoogleLinked = true;
    pendingUser.value.password = "GOOGLE_OAUTH_ACCOUNT"; // 標記為 Google 帳號
    
    return { action: 'register' };
  };

  // 完成註冊
  const completeRegistration = () => {
    const newUser = {
      id: generateNextId(),
      ...pendingUser.value,
      walletBalance: 0 
    };
    
    userList.value.push(newUser);
    currentUser.value = newUser; 

    console.log("🎉 新會員註冊成功！資料庫已更新", newUser);
    resetPendingUser(); 
  };

  // ══════════════════════════════════════════════════════════════
  // 3. 登入狀態與 Actions
  // ══════════════════════════════════════════════════════════════
  const currentUser = ref(null);
  const isLoggedIn = computed(() => currentUser.value !== null);

  const login = (email, password) => {
    const user = userList.value.find(u => u.email === email && u.password === password);
    if (user) { currentUser.value = user; return true; }
    return false;
  };

  const logout = () => { currentUser.value = null; };

  return {
    userList, currentUser, pendingUser,
    isLoggedIn,
    login, logout,
    startGoogleRegistration, completeRegistration, resetPendingUser
  };
});
