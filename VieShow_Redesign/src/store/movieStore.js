// src/store/movieStore.js
// 電影資料共用 Store（Pinia）
// 所有組件從這裡取資料，不需要各自維護

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMovieStore = defineStore('movie', () => {

  // ══════════════════════════════════════════════════════════════
  // 電影清單（靜態假資料，期末專案不串 API）
  // ══════════════════════════════════════════════════════════════
  const movieList = ref([
    {
      id: 1,
      titleZh: '極限返航',
      titleEn: 'PROJECT HAIL MARY',
      posterUrl: 'https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260225016.jpg',
      releaseDate: '2026/03/18',
      duration: '156分',
      rating: '保護級',
      language: '英語',
      genre: '科幻、冒險',
    },
    {
      id: 2,
      titleZh: '你的名字',
      titleEn: 'YOUR NAME',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/zh/4/4e/Your_name_poster.jpg',
      releaseDate: '2016/08/26',
      duration: '106分',
      rating: '普遍級',
      language: '日語',
      genre: '動畫、愛情',
    },
    {
      id: 3,
      titleZh: '奧本海默',
      titleEn: 'OPPENHEIMER',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/zh/7/7a/Oppenheimer_%28film%29_poster.jpg',
      releaseDate: '2023/07/21',
      duration: '180分',
      rating: '輔15級',
      language: '英語',
      genre: '傳記、劇情',
    },
    {
      id: 4,
      titleZh: '沙丘：第二部',
      titleEn: 'DUNE: PART TWO',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/zh/a/a1/Dune_Part_Two_Poster.jpg',
      releaseDate: '2024/02/29',
      duration: '166分',
      rating: '輔12級',
      language: '英語',
      genre: '科幻、史詩',
    },
  ])

  // ══════════════════════════════════════════════════════════════
  // 目前選中的電影 ID
  // ══════════════════════════════════════════════════════════════
  const selectedMovieId = ref(movieList.value[0].id)

  // ══════════════════════════════════════════════════════════════
  // 訂票場次資訊（使用者選完場次後會更新）
  // ══════════════════════════════════════════════════════════════
  const selectedSession = ref({
    format: '4DX',
    venue: '台北信義威秀',
    date: '2026年4月28日(二)',
    time: '19:30',
  })

  // ══════════════════════════════════════════════════════════════
  // Computed：各組件直接取用，不需要自己組裝資料
  // ══════════════════════════════════════════════════════════════

  // 目前選中的電影完整資料
  const selectedMovie = computed(() =>
    movieList.value.find(m => m.id === selectedMovieId.value) || null
  )

  // ① MovieCards 用：只取卡片需要的欄位
  const movieCardList = computed(() =>
    movieList.value.map(m => ({
      id:          m.id,
      titleZh:     m.titleZh,
      titleEn:     m.titleEn,
      posterUrl:   m.posterUrl,
      releaseDate: m.releaseDate,
    }))
  )

  // ② SelectedInfoCard 用：選中電影 + 場次資訊合併
  const selectedInfoCard = computed(() => {
    if (!selectedMovie.value) return null
    return {
      // 電影基本資訊
      titleZh:   selectedMovie.value.titleZh,
      titleEn:   selectedMovie.value.titleEn,
      posterUrl: selectedMovie.value.posterUrl,
      duration:  selectedMovie.value.duration,
      rating:    selectedMovie.value.rating,
      language:  selectedMovie.value.language,
      // 場次資訊
      format:    selectedSession.value.format,
      venue:     selectedSession.value.venue,
      date:      selectedSession.value.date,
      time:      selectedSession.value.time,
    }
  })

  // ══════════════════════════════════════════════════════════════
  // Actions：組件呼叫這些方法來更新資料
  // ══════════════════════════════════════════════════════════════

  // 選擇電影（MovieCards 點擊時呼叫）
  const selectMovie = (movieId) => {
    selectedMovieId.value = movieId
  }

  // 更新場次（Sessions.vue 選完場次後呼叫）
  const updateSession = (sessionData) => {
    selectedSession.value = { ...selectedSession.value, ...sessionData }
  }

  return {
    // State
    movieList,
    selectedMovieId,
    selectedSession,
    // Computed
    selectedMovie,
    movieCardList,
    selectedInfoCard,
    // Actions
    selectMovie,
    updateSession,
  }
})