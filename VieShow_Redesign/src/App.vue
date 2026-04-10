<template>
  <div class="app-wrapper">

    <BookingLayoutPC>
      <template #content>
        <!-- 右側放訂票流程組件，這裡用佔位內容預覽版面 -->
        <div class="preview-placeholder d-flex flex-column gap-3">
          <p class="text-secondary small">← 右側為訂票流程區（票種選擇 / 選位 / 加購 / 確認付款）</p>
          <div class="placeholder-block">選擇票種</div>
          <div class="placeholder-block">選擇座位</div>
          <div class="placeholder-block">加購餐點</div>
        </div>
      </template>
    </BookingLayoutPC>

  </div>
</template>

<script setup>
import { useMovieStore } from '@/store/movieStore'
import BookingLayoutPC from '@/components/Booking/BookingLayoutPC.vue'

const movieStore = useMovieStore()

// 對應 movieStore 裡的 id: 1（極限返航）
movieStore.selectMovie(1)
movieStore.updateSession({
  format:      '4DX',
  venue:       '台北信義威秀',
  date:        '2026年4月28日(二)',
  time:        '19:30',
})
</script>

<style lang="scss">
@import "@/assets/scss/main";

.app-wrapper {
  min-height: 100vh;
  background: $vieshow-gradient-dark;
}

// 佔位預覽用，正式使用時移除
.preview-placeholder {
  padding: $spacing-md-mobile;
}

.placeholder-block {
  background: rgba($white, 0.05);
  border: 1px dashed rgba($white, 0.2);
  border-radius: 8px;
  padding: 24px;
  color: rgba($white, 0.5);
  font-size: $font-size-sm-mobile;
  text-align: center;
}
</style>