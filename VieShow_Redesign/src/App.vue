<template>

 
  <div class="app-wrapper">
     <BookingSuccess/>
    <div class="container py-4">
      <div class="d-flex flex-column gap-5">

        <!-- 模板一：其他票種（臨櫃付款）-->
        <div>
          <p class="preview-label">模板一：其他票種</p>
          <OrderCompleteCard
            variant="other"
            ticket-status="pending"
          />
        </div>

        <!-- 模板二：一般購票流程（條碼 + 票種列表）-->
        <div>
          <p class="preview-label">模板二：一般購票流程</p>
          <OrderCompleteCard
            variant="standard"
            ticket-status="active"
            :tickets="ticketList"
            barcode-number="12345678"
            pickup-code="#FS-3076"
            @share-ticket="onShareTicket"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useMovieStore } from '@/store/movieStore.js'
import OrderCompleteCard from '@/components/Booking/FastBooking/OrderCompleted/OrderCompleteCard.vue'
import BookingSuccess from '@/components/Booking/FastBooking/OrderCompleted/BookingSuccess.vue'

const movieStore = useMovieStore()

// 選擇電影：id 必須是數字，對應 movieList 裡的 id: 1（極限返航）
movieStore.selectMovie(1)

// 更新場次資訊
movieStore.updateSession({
  format: '4DX',
  venue:  '台北信義威秀',
  date:   '2026年4月28日(二)',
  time:   '19:30',
})

const ticketList = [
  { id: 't1', name: '全票',                      quantity: 1 },
  { id: 't2', name: '全票',                      quantity: 1 },
  { id: 't3', name: '優待票',                    quantity: 1 },
  { id: 't4', name: '星展一般卡假日優惠 PLUS20', quantity: 1 },
]

const onShareTicket = (ticketId) => {
  console.log('分享票券 id：', ticketId)
}
</script>

<style lang="scss">
@import "@/assets/scss/main";

.app-wrapper {
  min-height: 100vh;
  background: $vieshow-gradient-dark;
}

.preview-label {
  font-size: $font-size-mini-mobile;
  color: $vieshow-secondary;
  margin-bottom: 8px;
}
</style>