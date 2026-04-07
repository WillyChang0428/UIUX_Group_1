<script setup>
import Header from "@/components/Layout/Parts/Header/Header.vue";
import Footer from "@/components/Layout/Parts/Footer/Footer.vue";
import HomeBanner from "@/components/Home/HomeBanner.vue";
import HomeHotMovie from "@/components/Home/HomeHotMovie.vue";
import HomeLiveConcert from "@/components/Home/HomeLiveConcert.vue";
import HomeNewsSection from "@/components/Home/HomeNewsSection.vue";
import HomeSectionTitle from "@/components/Home/HomeSectionTitle.vue";
import SelectBox from "@/components/Common/Selecter/SelectBox.vue";
import HomeVideo from "@/components/Home/HomeVideo.vue";
import GoOnTop from "@/components/Common/Button/GoOnTop.vue";
</script>

<template>
  <div class="main-wrapper">
    <Header />
    <HomeBanner />
    <div class="select-box container my-5">
      <SelectBox mode="home" />
    </div>
    <div class="hot-movie container">
      <HomeSectionTitle title="熱門電影" link="/movie" />
    </div>
    <HomeHotMovie />
    <div class="container">
      <HomeSectionTitle title="LIVE演唱會" link="/live" />
    </div>
    <HomeLiveConcert />
    <div class="container">
      <HomeSectionTitle title="最新消息" link="/news" />
    </div>
    <HomeNewsSection />
    <Footer />
    <HomeVideo />
    <GoOnTop />
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/variables"; // 💡 確保引入地基
body {
  height: fit-content;
  background: v.$vieshow-gradient-dark;
}

.select-box {
  position: absolute;
  top: 530px;
  /* 💡 關鍵：設定較高的 z-index 確保它在 banner 之後、其他內容之前 */
  z-index: 100; 
  left: 50%;
  transform: translateX(-50%); // 確保 absolute 下依然置中
  
  @include media-breakpoint-up(md) {
    position: relative;
    top: 0;
    transform: none;
    left: 0;
    /* 💡 桌機版同樣需要 z-index 防止被下方的 slider 蓋住 */
    z-index: 100; 
    // 抵消 Bootstrap container 的預設 margin 影響，視需求調整
    margin-top: -50px; 
  }
}

.hot-movie {
  /* 確保下方的內容層級較低 */
  position: relative;
  z-index: 1;
  padding-top: var(--gap-3xl);
  
  @include media-breakpoint-up(md) {
    padding-top: 0;
  }
}
</style>
