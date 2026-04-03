import { defineStore } from 'pinia'

export const useNewsStore = defineStore('news', {
    state: () => ({
        // 新聞資料陣列
        newsList: [
            {
                id: '1',
                title: 'LE SSERAFIM VR CONCERT : INVITATION ▎專屬 VR 特典',
                posterUrl: 'https://www.unicornpopcorn.com.tw/ForVsWeb/upload/event/event_20260401001.jpg',
                content: '凡於指定活動期間觀賞《LE SSERAFIM VR CONCERT : INVITATION》VR演唱會，即可憑「電影票根」或出示官方APP畫面，至影城指定櫃台領取「VR當周專屬特典乙份」。',
                date: '2026/04/17'
            },
            {
                id: '2',
                title: '《抓馬戀人》終成眷屬特別場',
                posterUrl: 'https://www.unicornpopcorn.com.tw/ForVsWeb/upload/event/event_20260327001.PNG',
                content: '凡購買《抓馬戀人 》特別場，即可於入場前獲得「終成眷屬特別場專屬套組乙份」，數量有限，送完為止！',
                date: '2026/04/02'
            },
            {
                id: '3',
                title: '《超級瑪利歐銀河電影版》TITAN SCREEN特別場',
                posterUrl: 'https://www.unicornpopcorn.com.tw/ForVsWeb/upload/event/event_20260326002.jpg',
                content: '購買此特別場套票，可收藏【獨家】「耀西造型爆米花桶」以及「威秀獨家貼紙」，再抽獨家驚喜贈品！散場影廳公佈中獎座位',
                date: '2026/04/05'
            },
            {
                id: '4',
                title: '《弒婚遊戲：２度開局》獨家特別場',
                posterUrl: 'https://www.unicornpopcorn.com.tw/ForVsWeb/upload/event/event_20260325001.JPG',
                content: '限定特典：姊妹情深A3海報組 (共3款)（統一於活動當日入場時憑電影票領取）散場抽加碼驚喜禮(5名/影城)+空運電影原版海報(約70*100cm)',
                date: '2026/04/03'
            },
        ]
    })
})