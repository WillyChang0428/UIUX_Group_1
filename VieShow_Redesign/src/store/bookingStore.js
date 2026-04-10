import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useBookingStore = defineStore('booking', () => {
    // ==========================================
    // 1. State (狀態變數)
    // ==========================================

    // 🧾 新增：發票資訊狀態
    const receipt = ref({
        type: 'personal-e', // 預設個人電子發票
        barcode: '',
        taxId: '',
        charityId: ''
    });

    // 🆙 新增：更新發票資訊的方法
    const updateReceipt = (newReceiptData) => {
        receipt.value = newReceiptData;
    };

    // 🎫 票種清單 (預設數量皆為 0)
    const tickets = ref({
        limited: { comboA: 0, comboB: 0 },                        // 限定套票: A, B
        general: { full: 0, concession: 0 },                      // 一般票種: 全票, 優待票
        bank: { bankA: 0, bankB: 0, bankC: 0 },                   // 銀行優惠: A, B, C
        other: { free: 0, senior: 0, group: 0 }                   // 其他票種: 免費兌換券, 敬老愛心票, 團體票
    });

    // 💺 座位清單 (陣列形式，例如: [{ row: 'A', num: 1 }, { row: 'A', num: 2 }])
    const seats = ref([{ row: 'A', num: 1 }]);

    // 🍿 餐飲加購清單 (預設數量皆為 0)
    const foods = ref({
        popcorn: { large: 0, medium: 0, small: 0 },               // 爆米花: 大, 中, 小
        drink: { large: 0, medium: 0, small: 0 },                 // 飲料: 大, 中, 小
        hotFood: { hotDog: 0, churro: 0 },                        // 熟食: hot dog, Churro
        bankCombo: { dbs: 0, tsib: 0 }                            // 銀行優惠餐: DBS, TSIB
    });


    // ==========================================
    // 2. Getters (計算屬性)
    // ==========================================

    // 自動計算「總共選了幾張票」，方便在選位頁面限制最多能選幾個位子
    const totalTicketCount = computed(() => {
        let count = 0;
        for (const category in tickets.value) {
            for (const type in tickets.value[category]) {
                // 💡 判斷：如果是「限定套票(limited)」，因為是雙人套票，所以數量要乘以 2
                if (category === 'limited') {
                    count += tickets.value[category][type] * 2;
                } else {
                    // 其他一般票種則維持 1:1 計算
                    count += tickets.value[category][type];
                }
            }
        }
        return count;
    });


    // ==========================================
    // 3. Actions (更新與操作方法)
    // ==========================================

    // 🆙 更新票種數量 (傳入: 大類別, 票種, 新數量)
    const updateTicket = (category, type, quantity) => {
        if (tickets.value[category] && tickets.value[category][type] !== undefined) {
            // 使用 Math.max 確保數量不會變成負數
            tickets.value[category][type] = Math.max(0, quantity);
        }
    };

    // 🆙 更新餐飲數量
    const updateFood = (category, type, quantity) => {
        if (foods.value[category] && foods.value[category][type] !== undefined) {
            foods.value[category][type] = Math.max(0, quantity);
        }
    };

    // 💺 更新座位 (直接傳入整個新的座位陣列)
    const updateSeats = (newSeatsArray) => {
        seats.value = newSeatsArray;
    };

    // 🧹 訂購完成：全數歸零重置 
    const resetBooking = () => {
        // 票種歸零
        for (const category in tickets.value) {
            for (const type in tickets.value[category]) {
                tickets.value[category][type] = 0;
            }
        }
        // 餐飲歸零
        for (const category in foods.value) {
            for (const type in foods.value[category]) {
                foods.value[category][type] = 0;
            }
        }
        // 座位清空
        seats.value = [];
        receipt.value = { type: 'personal-e', barcode: '', taxId: '', charityId: '' };
    };

    return {
        // 匯出變數
        tickets,
        seats,
        foods,
        totalTicketCount,
        // 匯出方法
        updateTicket,
        updateFood,
        updateSeats,
        resetBooking,
        receipt,         // 匯出發票變數
        updateReceipt    // 匯出更新方法
    };
});