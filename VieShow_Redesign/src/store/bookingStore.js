import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useBookingStore = defineStore("booking", () => {
  // ── 1. State (狀態變數) ──
  const tickets = ref([]); // 一般票種
  const combos = ref([]); // 套票
  const selectedSeats = ref([]); // 選中的座位
  const foodAddOns = ref([]); // 加購餐飲
  const receipt = ref({
    type: "personal-e",
    barcode: "",
    taxId: "",
    charityId: "",
  });
  const paymentMethod = ref(null);

  // ── 2. Computed (自動計算總計) ──
  // 💡 關鍵邏輯：計算總票數 (套票 1 份 = 2 個位子，所以乘以 2)
  const totalTicketCount = computed(() => {
    const tCount = tickets.value.reduce((sum, t) => sum + t.quantity, 0);
    const cCount = combos.value.reduce((sum, c) => sum + c.quantity * 2, 0);
    return tCount + cCount;
  });

  // 💡 各項金額與最終總計
  const ticketTotal = computed(() =>
    tickets.value.reduce((sum, t) => sum + t.price * t.quantity, 0),
  );
  const comboTotal = computed(() =>
    combos.value.reduce((sum, c) => sum + c.price * c.quantity, 0),
  );
  const foodTotal = computed(() =>
    foodAddOns.value.reduce((sum, f) => sum + f.price * f.quantity, 0),
  );
  const finalTotal = computed(
    () => ticketTotal.value + comboTotal.value + foodTotal.value,
  );

  // ── 3. Actions (更新資料的方法) ──
  const updateTickets = (newTickets) => (tickets.value = newTickets);
  const updateCombos = (newCombos) => (combos.value = newCombos);
  const updateSeats = (seats) => (selectedSeats.value = seats);
  const updateFoodAddOns = (foods) => (foodAddOns.value = foods);
  const updateReceipt = (newData) => (receipt.value = newData);
  const setPaymentMethod = (method) => {
    paymentMethod.value = method;
  };

  // 完成訂單後清空購物車
  const resetBooking = () => {
    tickets.value = [];
    combos.value = [];
    selectedSeats.value = [];
    foodAddOns.value = [];
    receipt.value = {
      type: "personal-e",
      barcode: "",
      taxId: "",
      charityId: "",
    };
    paymentMethod.value = null;
  };

  return {
    tickets,
    combos,
    selectedSeats,
    foodAddOns,
    receipt,
    totalTicketCount,
    ticketTotal,
    comboTotal,
    foodTotal,
    finalTotal,
    updateTickets,
    updateCombos,
    updateSeats,
    updateFoodAddOns,
    updateReceipt,
    resetBooking,
    paymentMethod,
    setPaymentMethod,
  };
});
