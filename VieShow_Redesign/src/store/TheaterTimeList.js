// src/store/TheaterTimeList.js

/**
 * 💡 基礎時刻表範本
 * 為了配合 TimeButton.vue 的滿位狀態，將字串改為包含 isFull 的物件
 */
const baseShowtimesTemplate = {
  "數位": {
    "星期一": [{ time: "10:00", isFull: false }, { time: "13:20", isFull: true }, { time: "16:00", isFull: false }, { time: "19:40", isFull: false }],
    "星期二": [{ time: "10:00", isFull: false }, { time: "13:20", isFull: false }, { time: "16:00", isFull: false }, { time: "19:40", isFull: true }],
    "星期三": [{ time: "10:00", isFull: false }, { time: "13:20", isFull: false }, { time: "16:00", isFull: true }, { time: "19:40", isFull: false }],
    "星期四": [{ time: "10:00", isFull: false }, { time: "13:20", isFull: false }, { time: "16:00", isFull: false }, { time: "19:40", isFull: false }],
    "星期五": [{ time: "10:00", isFull: false }, { time: "13:20", isFull: false }, { time: "16:00", isFull: false }, { time: "19:40", isFull: false }, { time: "22:10", isFull: true }],
    "星期六": [{ time: "10:00", isFull: true }, { time: "13:20", isFull: true }, { time: "16:00", isFull: false }, { time: "19:40", isFull: false }, { time: "22:10", isFull: false }],
    "星期日": [{ time: "10:00", isFull: false }, { time: "13:20", isFull: false }, { time: "16:00", isFull: true }, { time: "19:40", isFull: false }, { time: "22:10", isFull: false }],
  },
  "IMAX": {
    "星期一": [{ time: "11:00", isFull: false }, { time: "14:30", isFull: false }, { time: "18:00", isFull: true }],
    "星期二": [{ time: "11:00", isFull: false }, { time: "14:30", isFull: false }, { time: "18:00", isFull: false }],
    "星期三": [{ time: "11:00", isFull: true }, { time: "14:30", isFull: false }, { time: "18:00", isFull: false }],
    "星期四": [{ time: "11:00", isFull: false }, { time: "14:30", isFull: true }, { time: "18:00", isFull: false }],
    "星期五": [{ time: "11:00", isFull: false }, { time: "14:30", isFull: false }, { time: "18:00", isFull: false }, { time: "21:30", isFull: false }],
    "星期六": [{ time: "11:00", isFull: false }, { time: "14:30", isFull: true }, { time: "18:00", isFull: true }, { time: "21:30", isFull: false }],
    "星期日": [{ time: "11:00", isFull: false }, { time: "14:30", isFull: false }, { time: "18:00", isFull: false }, { time: "21:30", isFull: true }],
  },
  "4DX": {
    "星期一": [{ time: "12:00", isFull: false }, { time: "15:40", isFull: true }, { time: "19:20", isFull: false }],
    "星期二": [{ time: "12:00", isFull: false }, { time: "15:40", isFull: false }, { time: "19:20", isFull: false }],
    "星期三": [{ time: "12:00", isFull: true }, { time: "15:40", isFull: false }, { time: "19:20", isFull: false }],
    "星期四": [{ time: "12:00", isFull: false }, { time: "15:40", isFull: false }, { time: "19:20", isFull: true }],
    "星期五": [{ time: "12:00", isFull: false }, { time: "15:40", isFull: false }, { time: "19:20", isFull: false }],
    "星期六": [{ time: "12:00", isFull: false }, { time: "15:40", isFull: true }, { time: "19:20", isFull: false }],
    "星期日": [{ time: "12:00", isFull: false }, { time: "15:40", isFull: false }, { time: "19:20", isFull: true }],
  }
};

/**
 * 💡 動態生成所有電影與影城的時刻表關聯資料庫
 * @param {Array} movieList - 來自 movieStore 的電影清單
 * @param {Array} cinemaList - 來自 cinemaStore 的影城清單
 * @returns {Object} 檢索格式： data[movieId][theaterName]
 */
export const generateShowtimeData = (movieList, cinemaList) => {
  const showtimeDatabase = {};

  // 1. 遍歷每一部電影
  movieList.forEach((movie) => {
    showtimeDatabase[movie.id] = {};

    // 2. 遍歷每一個區域與影城
    cinemaList.forEach((region) => {
      region.theaters.forEach((theaterName) => {
        
        // 💡 為了讓假資料看起來真實一點，隨機決定這間影城有沒有 IMAX 或 4DX
        // 大型影城 (如信義、大遠百) 擁有所有版本，其他影城隨機刪減
        let formats = ["數位", "IMAX", "4DX"];
        if (!theaterName.includes('信義') && !theaterName.includes('大遠百')) {
          // 隨機移除某些特殊影廳，增加真實感
          if (Math.random() > 0.5) formats = formats.filter(f => f !== "4DX");
          if (Math.random() > 0.7) formats = formats.filter(f => f !== "IMAX");
        }

        // 依據決定好的 formats，過濾出該影城的時刻表
        const theaterShowtimes = {};
        formats.forEach(format => {
          theaterShowtimes[format] = baseShowtimesTemplate[format];
        });

        // 3. 綁定電影 ID -> 影城名稱 -> 時刻表資料
        showtimeDatabase[movie.id][theaterName] = {
          availableFormats: formats,
          showtimes: theaterShowtimes
        };

      });
    });
  });

  return showtimeDatabase;
};