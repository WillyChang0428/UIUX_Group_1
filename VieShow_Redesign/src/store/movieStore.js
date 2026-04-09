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

  //即將上映
  const upComingMovie = ref([
    {
      id: 1,
      titleZh: "科學新娘！",
      titleEn: "The Bride!",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260223019.jpg",
      releaseDate: "2026/04/18",
      duration: "139分",
      rating: "輔12級",
      language: "英語",
      genre: "科幻、劇情",
      director: "奉俊昊",
      cast: "羅伯·派汀森、東妮·克莉蒂、馬克·魯法洛",
      synopsis:
        "一名被稱為「消耗品」的複製人被派往冰凍星球進行殖民任務。每當他死去，新的身體就會帶著之前的記憶重生，直到他發現自己被捲入了一場關於生存本質的道德危機。",
      trailerUrl: "https://www.youtube.com/watch?v=A_v_F_V_Example1",
    },
    {
      id: 2,
      titleZh: "鬼娃娃",
      titleEn: "Doll House",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260225022.jpg",
      releaseDate: "2026/06/12",
      duration: "118分",
      rating: "輔15級",
      language: "英語",
      genre: "驚悚、恐怖",
      director: "溫子仁",
      cast: "派翠克·威爾森、維拉·法梅加",
      synopsis:
        "一支深海探測隊在馬里亞納海溝最深處發現了一座古老的祭壇。隨著潛水艇電力受損，黑暗中不明的獵殺者開始悄悄逼近，他們必須在氧氣耗盡前回到地表。",
      trailerUrl: "https://www.youtube.com/watch?v=B_v_F_V_Example2",
    },
    {
      id: 3,
      titleZh: "忌念日：極權元年",
      titleEn: "Anniversary",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260225008.jpg",
      releaseDate: "2026/08/05",
      duration: "125分",
      rating: "保護級",
      language: "日語",
      genre: "動畫、動作",
      director: "新海誠",
      cast: "神木隆之介、上白石萌音",
      synopsis:
        "在 2088 年的科技都市，一名天才駭客意外解開了城市中央 AI 的禁忌編碼。隨著霓虹燈光開始閃爍異常，整個城市的命運與一位神秘少女的夢境連在了一起。",
      trailerUrl: "https://www.youtube.com/watch?v=C_v_F_V_Example3",
    },
    {
      id: 4,
      titleZh: "F1電影 重映",
      titleEn: "F1",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20250603001.jpg",
      releaseDate: "2026/09/22",
      duration: "142分",
      rating: "輔12級",
      language: "英語",
      genre: "動作、懸疑",
      director: "克里斯多福·諾蘭",
      cast: "席尼·墨菲、湯姆·哈迪",
      synopsis:
        "當未來政府發現有人試圖竄改 1945 年的歷史時，一名經驗老道的「時空警探」被派回過去，但他很快發現，真正威脅人類未來的並非歷史變更，而是他即將面對的另一個自己。",
      trailerUrl: "https://www.youtube.com/watch?v=D_v_F_V_Example4",
    },
    {
      id: 5,
      titleZh: "阿凡達：火與燼",
      titleEn: "Avatar: Fire and Ash",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20251110013.jpg",
      releaseDate: "2026/07/11",
      duration: "134分",
      rating: "普遍級",
      language: "法語",
      genre: "冒險、家庭",
      director: "呂克·貝松",
      cast: "蕾雅·瑟杜、讓·雷諾",
      synopsis:
        "在一片荒蕪、水源枯竭的世界裡，一位小女孩與她的機器人保鏢展開了橫跨沙漠的旅程。他們手中握著最後一顆綠色種子，那是恢復大地的唯一希望。",
      trailerUrl: "https://www.youtube.com/watch?v=E_v_F_V_Example5",
    },
    {
      id: 6,
      titleZh: "雙囍 ",
      titleEn: "Double Happiness",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260122001.jpg",
      releaseDate: "2026/05/01",
      duration: "105分",
      rating: "普遍級",
      language: "英語",
      genre: "音樂、浪漫",
      director: "達米恩·查澤雷",
      cast: "艾瑪·史東、安雅·泰勒-喬伊",
      synopsis:
        "一位落魄的鋼琴師與一名極具天賦的小提琴家在維也納的街頭相遇。他們試圖共同創作出一首能療癒世人痛苦的完美交響樂，卻也必須面對成名背後的痛苦代價。",
      trailerUrl: "https://www.youtube.com/watch?v=F_v_F_V_Example6",
    },
    {
      id: 7,
      titleZh: "驚聲尖叫 7",
      titleEn: "SCREAM 7",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20260122022.jpg",
      releaseDate: "2026/04/18",
      duration: "128分",
      rating: "輔12級",
      language: "華語",
      genre: "犯罪、懸疑",
      director: "程偉豪",
      cast: "許光漢、林柏宏",
      synopsis:
        "虛擬世界「綠洲」發生了一起不可能發生的謀殺案。現實世界的刑警必須戴上裝置，進入充滿陷阱與虛假資訊的數位空間，追緝那個能隨時變換身分的連環殺手。",
      trailerUrl: "https://www.youtube.com/watch?v=G_v_F_V_Example7",
    },
    {
      id: 8,
      titleZh: "動物方城市2",
      titleEn: "Zootopia 2",
      posterUrl:
        "https://www.unicornpopcorn.com.tw/ForVsWeb/upload/film/film_20251103043.jpg",
      releaseDate: "2026/02/10",
      duration: "115分",
      rating: "保護級",
      language: "英語",
      genre: "冒險、奇幻",
      director: "史蒂芬·史匹柏",
      cast: "湯姆·霍蘭德、贊達亞",
      synopsis:
        "年輕的考古學者在埃及金字塔下方發現了一個未知的密室。這不是墳墓，而是一座保存外星文明科技的博物館。當封印被解開，世界各地的古文明遺跡竟開始同時發出訊號。",
      trailerUrl: "https://www.youtube.com/watch?v=H_v_F_V_Example8",
    },
  ]);

  // ══════════════════════════════════════════════════════════════
  // 目前選中的電影 ID
  // ══════════════════════════════════════════════════════════════
  const selectedMovieId = ref(null);

  // ══════════════════════════════════════════════════════════════
  // 訂票場次資訊（使用者選完場次後會更新）
  // ══════════════════════════════════════════════════════════════
  const selectedSession = ref({
    format: "版本",
    venue: "影城",
    date: "日期",
    time: "時段",
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
    upComingMovie,
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
