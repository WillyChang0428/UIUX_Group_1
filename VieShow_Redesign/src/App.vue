<template>
  <router-view/>
</template>

<script setup>
import { useMovieStore } from '@/store/movieStore'
import BookingLayoutPC from '@/components/Booking/BookingLayoutPC.vue'

</script>


<style lang="scss">
html,
body,
#app {
  height: fit-content;
  background: v.$vieshow-gradient-dark;
}

</style>