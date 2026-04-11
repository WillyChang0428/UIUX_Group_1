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
  const selectedCard = ref(null); // 💡 紀錄選用的信用卡

  // ── 2. Computed (自動計算總計) ──

  // 1. 計算總票數
  const totalTicketCount = computed(() => {
    const normalTickets = tickets.value.reduce((sum, t) => sum + (t.quantity || 0), 0);
    const comboTickets = combos.value.reduce((sum, combo) => sum + combo.quantity * (combo.ticketCount || 1), 0);
    return normalTickets + comboTickets;
  });

  const ticketsTotal = computed(() => {
    return tickets.value.reduce((sum, t) => sum + (t.price || 0) * (t.quantity || 0), 0);
  });

  const combosTotal = computed(() => {
    return combos.value.reduce((sum, combo) => sum + (combo.price || 0) * (combo.quantity || 0), 0);
  });

  const foodsTotal = computed(() => {
    return foodAddOns.value.reduce((sum, food) => sum + (food.price || 0) * (food.quantity || 0), 0);
  });

  // 商品總金額 (票 + 套票 + 餐飲)
  const finalTotal = computed(() => {
    return ticketsTotal.value + combosTotal.value + foodsTotal.value;
  });

  // 💡 架構升級：把散落在各元件的手續費計算，統一收回大腦！
  const handlingFee = computed(() => {
    return totalTicketCount.value * 20; // 每張票 20 元手續費
  });

  // 💡 架構升級：包含手續費的「最終結帳金額」
  const checkoutTotal = computed(() => {
    return finalTotal.value + handlingFee.value;
  });

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
  const updateSelectedCard = (card) => {
    selectedCard.value = card;
  };

  return {
    tickets,
    combos,
    selectedSeats,
    foodAddOns,
    receipt,
    paymentMethod,
    totalTicketCount,
    ticketsTotal, 
    combosTotal,   
    foodsTotal,   
    finalTotal,
    handlingFee,   // 💡 記得 return 出去給元件用
    checkoutTotal, // 💡 記得 return 出去給元件用
    updateTickets,
    updateCombos,
    updateSeats,
    updateFoodAddOns,
    updateReceipt,
    resetBooking,
    setPaymentMethod,
    selectedCard,
    updateSelectedCard,
  };
});