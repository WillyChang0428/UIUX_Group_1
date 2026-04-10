import { defineStore } from 'pinia'

export const useCinemaStore = defineStore('cinema', {
  state: () => ({
    // 💡 新增：儲存使用者選取的影城與區域
    selectedCinema: '',
    selectedRegion: 'north', 
    
    // 影城資料陣列 (保留您原本的資料)
    cinemaList: [
      { id: 'north', label: '雙北', theaters: ['台北信義', '台北京站', '台北南港LaLaport', '台北西門', '新店裕隆城', '板橋大遠百', '中和環球', '林口MITSUI OUTLET PARK'] },
      { id: 'taoyuan', label: '桃竹苗', theaters: ['桃園統領', '桃園桃知道', '新竹大遠百', '新竹巨城', '頭份尚順'] },
      { id: 'central', label: '中部', theaters: ['台中大遠百', '台中大魯閣新時代'] },
      { id: 'south', label: '南部', theaters: ['台南大遠百', '台南FOCUS', '台南南紡', '高雄大遠百'] },
      { id: 'east', label: '東部', theaters: ['花蓮新天堂樂園'] },
    ]
  }),
  actions: {
    // 💡 新增：設定影城時，自動反推並儲存它是哪一個「區域」
    setCinema(theaterName) {
      this.selectedCinema = theaterName;
      if (!theaterName) return;

      const region = this.cinemaList.find(r => r.theaters.includes(theaterName));
      if (region) {
        this.selectedRegion = region.id;
      }
    },
    clearCinema() {
      this.selectedCinema = '';
      this.selectedRegion = 'north';
    }
  }
})