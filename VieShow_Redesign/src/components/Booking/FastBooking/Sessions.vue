<template>
  <div class="sessions-container">
    
    <div class="version-filter-section mb-4" v-if="globalAvailableFormats.length > 0">
      <VersionSelector 
        v-model="selectedFormat"
        :availableFormats="globalAvailableFormats"
      />
    </div>

    <template v-if="moviesWithShowtimes.length > 0">
      
      <div 
        v-for="item in moviesWithShowtimes" 
        :key="item.movie.id" 
        class="movie-session-group"
      >
        <h4 class="movie-title fw-bold d-flex align-items-center">
          <img 
            v-if="getRatingIcon(item.movie.rating)"
            :src="getRatingIcon(item.movie.rating)" 
            :alt="item.movie.rating"
            class="rating-icon me-2"
          />
          {{ item.movie.titleZh }}
        </h4>

        <div 
          v-for="format in item.formats" 
          :key="format"
          class="format-group"
        >
          <div class="format-title mb-2">
            {{ format }} / 英
          </div>

          <div class="time-list d-flex flex-wrap">
            <TimeButton 
              v-for="(session, index) in item.sessions[format]" 
              :key="index"
              :time="session.time"
              :isFull="session.isFull"
              @book="handleBooking(item.movie, format, session)"
              @preview="handlePreview(item.movie, format, session)"
            />
          </div>
        </div>
      </div>

    </template>

    <template v-else>
      <div class="no-sessions d-flex align-items-center justify-content-center">
        <span class="text-secondary">目前選擇的條件下無開放場次</span>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useMovieStore } from '@/store/movieStore';
import { useCinemaStore } from '@/store/cinema';
import { generateShowtimeData } from '@/store/TheaterTimeList'; 
import TimeButton from './Button/TimeButton.vue'; 
import VersionSelector from './VersionSelector.vue'; 

// 💡 顯式引入分級圖片，確保 Vite 打包時能正確解析路徑
import imgG from '@/assets/images/movie_level/普遍級.png';
import imgP from '@/assets/images/movie_level/保護級.png';
import imgPG12 from '@/assets/images/movie_level/輔12級.png';
import imgPG15 from '@/assets/images/movie_level/輔15級.png';
import imgR from '@/assets/images/movie_level/限制級.png';

// 💡 建立對應字典
const ratingIconMap = {
  '普遍級': imgG,
  '保護級': imgP,
  '輔12級': imgPG12,
  '輔15級': imgPG15,
  '限制級': imgR
};

// 💡 取得圖片路徑的函數
const getRatingIcon = (rating) => {
  return ratingIconMap[rating] || '';
};

const props = defineProps({
  theaterName: {
    type: String,
    default: '台北信義' 
  },
  dayOfWeek: {
    type: String,
    default: '星期一' 
  }
});

const emit = defineEmits(['select-session', 'open-preview']);
const movieStore = useMovieStore();
const cinemaStore = useCinemaStore();

const showtimeDatabase = generateShowtimeData(movieStore.movieList, cinemaStore.cinemaList);

const selectedFormat = ref('所有版本');

watch([() => props.theaterName, () => props.dayOfWeek, () => movieStore.selectedMovieId], () => {
  selectedFormat.value = '所有版本';
});

const globalAvailableFormats = computed(() => {
  const formats = new Set();
  const theater = props.theaterName;
  const day = props.dayOfWeek;
  const selectedMovieId = movieStore.selectedMovieId;

  movieStore.movieList.forEach(movie => {
    if (selectedMovieId && selectedMovieId !== 'all' && movie.id !== selectedMovieId) return;

    const theaterData = showtimeDatabase[movie.id]?.[theater];
    if (theaterData) {
      theaterData.availableFormats.forEach(f => {
        if (theaterData.showtimes[f]?.[day]?.length > 0) {
          formats.add(f);
        }
      });
    }
  });
  return Array.from(formats);
});

const moviesWithShowtimes = computed(() => {
  const theater = props.theaterName;
  const day = props.dayOfWeek;
  const selectedMovieId = movieStore.selectedMovieId;

  let result = [];

  movieStore.movieList.forEach(movie => {
    if (selectedMovieId && selectedMovieId !== 'all' && movie.id !== selectedMovieId) return;

    const theaterData = showtimeDatabase[movie.id]?.[theater];
    if (!theaterData) return;

    let formatsToRender = theaterData.availableFormats;
    if (selectedFormat.value !== '所有版本') {
      if (!formatsToRender.includes(selectedFormat.value)) return;
      formatsToRender = [selectedFormat.value];
    }

    let validFormats = [];
    let formatSessions = {};

    formatsToRender.forEach(format => {
      const sessions = theaterData.showtimes[format]?.[day];
      if (sessions && sessions.length > 0) {
        validFormats.push(format);
        formatSessions[format] = sessions;
      }
    });

    if (validFormats.length > 0) {
      result.push({
        movie: movie,
        formats: validFormats,
        sessions: formatSessions
      });
    }
  });

  return result;
});

const handleBooking = (movie, format, session) => {
  emit('select-session', {
    movie: movie,
    format: format,
    time: session.time,
    venue: props.theaterName
  });
};

const handlePreview = (movie, format, session) => {
  emit('open-preview', { movie: movie, format: format, time: session.time });
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables"; 

.sessions-container {
  width: 100%;

  .movie-session-group {
    margin-bottom: var(--gap-xl); 
    padding-bottom: var(--gap-lg);
    border-bottom: 1px solid rgba(v.$white, 0.1); 

    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
  }

  .movie-title {
    color: v.$white;
    font-size: var(--app-font-size-h5); 
    margin-bottom: var(--gap-lg);
    
    .rating-icon {
      height: var(--app-font-size-h4); 
      width: auto;
      object-fit: contain;
    }
  }
  
  .format-group {
    margin-bottom: var(--gap-lg); 
    &:last-child {
      margin-bottom: 0;
    }
  }

  .format-title {
    color: v.$vieshow-secondary; 
    font-size: var(--app-font-size-sm); 
    letter-spacing: 0.5px;
  }

  .time-list {
    gap: var(--gap-md); 
  }

  .no-sessions {
    min-height: 150px;
    color: v.$vieshow-secondary;
    font-size: var(--app-font-size-base);
  }
}
</style>