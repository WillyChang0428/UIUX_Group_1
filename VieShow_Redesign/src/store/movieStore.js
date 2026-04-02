// src/store/movieStore.js
// 電影資料共用 Store（Pinia）
// 所有組件從這裡取資料，不需要各自維護

import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useMovieStore = defineStore("movie", () => {
  // ══════════════════════════════════════════════════════════════
  // 電影清單（靜態假資料，期末專案不串 API）
  // ══════════════════════════════════════════════════════════════
  const movieList = ref([
    {
      id: 1,
      titleZh: "極限返航",
      titleEn: "PROJECT HAIL MARY",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260225016.jpg",
      releaseDate: "2026/03/18",
      duration: "156分",
      rating: "保護級",
      language: "英語",
      genre: "科幻、冒險",
      director: "菲爾·洛德、克里斯多福·米勒",
      cast: "萊恩·葛斯林、珊卓·惠勒",
      synopsis:
        "一名失去記憶的太空人獨自在太空船上醒來，他必須在距離地球數光年之外的浩瀚宇宙中拼湊出自己的過去，並想辦法解開重重謎團，以拯救地球免於一場滅絕浩劫。",
      trailerUrl: "https://www.youtube.com/watch?v=V3IuR9Qlrj8",
    },
    {
      id: 2,
      titleZh: "狸想世界",
      titleEn: "HOPPERS",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260309007.jpg",
      releaseDate: "2026/03/18",
      duration: "104分",
      rating: "普遍級",
      language: "英語",
      genre: "動畫、冒險",
      director: "丹尼爾·鍾",
      cast: "喬·漢姆、派珀·柯達、鮑比·莫尼漢",
      synopsis:
        "科學家開發出一種革命性技術，可將人類意識「上身」進高度擬真的機器動物體內。主角梅寶藉此潛入動物世界探索未知，卻意外看透市長開發自然棲地的陰謀，決定挺身而出。",
      trailerUrl: "https://www.youtube.com/watch?v=UgxGRd5hfxU",
    },
    {
      id: 3,
      titleZh: "劇場版「暗殺教室」：我們的時光",
      titleEn: "Assassination Classroom the Movie: Our Time",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260309008.jpg",
      releaseDate: "2026/03/27",
      duration: "87分",
      rating: "保護級",
      language: "日語",
      genre: "動畫",
      director: "北村真咲",
      cast: "福山潤、杉田智和、伊藤靜、岡本信彥",
      synopsis:
        "這是在2月底，考試已經結束即將迎來畢業的某一天。在政府愈加嚴苛的監視之下，三年E班的同學們回憶起和殺老師一同度過的這一整年。",
      trailerUrl: "https://www.youtube.com/watch?v=oULcVaimSL8",
    },
    {
      id: 4,
      titleZh: "陽光女子合唱團",
      titleEn: "Sunshine Women's Choir",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20251121001.jpg",
      releaseDate: "2026/04/04",
      duration: "134分",
      rating: "保護級",
      language: "國語",
      genre: "劇情",
      director: "林孝謙",
      cast: "陳意涵、翁倩玉、鍾欣凌、孫淑媚",
      synopsis:
        "講述一群因不同原因而入獄的女受刑人，以「組成合唱團」互相扶持的故事。獄中母親李惠貞為給即將分離的女兒留下珍貴回憶，用歌聲對抗絕望，重燃生命微光。",
      trailerUrl: "https://www.youtube.com/watch?v=9okuA5dRl-s",
    },
    {
      id: 5,
      titleZh: "捕風追影",
      titleEn: "The Shadow's Edge",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260312006.jpg",
      releaseDate: "2026/03/27",
      duration: "141分",
      rating: "輔12級",
      language: "國語",
      genre: "動作、犯罪",
      director: "楊子",
      cast: "成龍、張子楓、梁家輝",
      synopsis:
        "世紀劫案震撼全城！影子集團帶著數億加密貨幣消失無蹤。隱退多年的跟蹤專家黃德忠「出山」，與年輕司警聯手和匪徒展開正邪對決。",
      trailerUrl: "https://www.youtube.com/watch?v=cJj8FLEpNzY",
    },
    {
      id: 6,
      titleZh: "3670",
      titleEn: "3670",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260330006.jpg",
      releaseDate: "2026/04/19",
      duration: "124分",
      rating: "輔15級",
      language: "韓語",
      genre: "劇情",
      director: "朴俊浩",
      cast: "曹有鉉、金賢睦",
      synopsis:
        "一名脫北者哲俊在首爾生活，努力在韓國同志圈尋找自己的歸屬感。他在聚會中結識了新朋友，生活逐漸綻放，但如何平衡兩種截然不同的身份成為他最大的挑戰。",
      trailerUrl: "https://www.youtube.com/watch?v=jCq50K4aVHg",
    },
    {
      id: 7,
      titleZh: "抓馬戀人",
      titleEn: "The Drama",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260312012.jpg",
      releaseDate: "2026/04/02",
      duration: "105分",
      rating: "輔12級",
      language: "英語",
      genre: "喜劇、愛情",
      director: "克里斯多佛·博格利",
      cast: "千黛亞、羅伯·派汀森",
      synopsis:
        "查理在咖啡廳被專注讀書的艾瑪深深吸引。兩人從笨拙的邂逅到步入婚姻殿堂，卻在婚禮上揭開不可告人的過往，甜蜜與危機同時上演！",
      trailerUrl: "https://www.youtube.com/watch?v=vxH_CEUf190",
    },
    {
      id: 8,
      titleZh: "邪降：覺醒",
      titleEn: "Panor2",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260225010.jpg",
      releaseDate: "2026/03/20",
      duration: "125分",
      rating: "限制級",
      language: "泰語",
      genre: "恐怖、驚悚",
      director: "普提彭·賽斯瑞考",
      cast: "丘普朗·阿瑞昆、傑克林·坤萬齊提柴",
      synopsis:
        "潘娜考取大學後慘遭學長姐殘酷霸凌，對方更私下求助降頭師施以致命巫術，卻意外喚醒潛藏在她體內的邪力，她信手捻來皆是索命降術，以牙還牙展開血色清算！",
      trailerUrl: "https://www.youtube.com/watch?v=9SRhVdayIts",
    },
  ]);

  // ══════════════════════════════════════════════════════════════
  // 目前選中的電影 ID
  // ══════════════════════════════════════════════════════════════
  const selectedMovieId = ref(movieList.value[0].id);

  // ══════════════════════════════════════════════════════════════
  // 訂票場次資訊（使用者選完場次後會更新）
  // ══════════════════════════════════════════════════════════════
  const selectedSession = ref({
    format: "4DX",
    venue: "台北信義威秀",
    date: "2026年4月28日(二)",
    time: "19:30",
  });

  // ══════════════════════════════════════════════════════════════
  // Computed：各組件直接取用，不需要自己組裝資料
  // ══════════════════════════════════════════════════════════════

  // 目前選中的電影完整資料
  const selectedMovie = computed(
    () => movieList.value.find((m) => m.id === selectedMovieId.value) || null,
  );

  // ① MovieCards 用：只取卡片需要的欄位
  const movieCardList = computed(() =>
    movieList.value.map((m) => ({
      id: m.id,
      titleZh: m.titleZh,
      titleEn: m.titleEn,
      posterUrl: m.posterUrl,
      releaseDate: m.releaseDate,
    })),
  );

  // ② SelectedInfoCard 用：選中電影 + 場次資訊合併
  const selectedInfoCard = computed(() => {
    if (!selectedMovie.value) return null;
    return {
      // 電影基本資訊
      titleZh: selectedMovie.value.titleZh,
      titleEn: selectedMovie.value.titleEn,
      posterUrl: selectedMovie.value.posterUrl,
      duration: selectedMovie.value.duration,
      rating: selectedMovie.value.rating,
      language: selectedMovie.value.language,
      genre: selectedMovie.value.genre,
      synopsis: selectedMovie.value.synopsis,
      director: selectedMovie.value.director,
      cast: selectedMovie.value.cast,
      // 場次資訊
      format: selectedSession.value.format,
      venue: selectedSession.value.venue,
      date: selectedSession.value.date,
      time: selectedSession.value.time,
    };
  });

  // ══════════════════════════════════════════════════════════════
  // Actions：組件呼叫這些方法來更新資料
  // ══════════════════════════════════════════════════════════════

  // 選擇電影（MovieCards 點擊時呼叫）
  const selectMovie = (movieId) => {
    selectedMovieId.value = movieId;
  };

  // 更新場次（Sessions.vue 選完場次後呼叫）
  const updateSession = (sessionData) => {
    selectedSession.value = { ...selectedSession.value, ...sessionData };
  };

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
  };
});
