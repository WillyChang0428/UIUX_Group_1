<script setup>
import Header from '@/components/Common/Header.vue'
</script>

<template>
    <div class="main-wrapper">
        <Header />
        <main class="app-main">
            <router-view />
        </main>
    </div>
</template>

<style scoped lang="scss">
.app-main {
    min-height: 100vh;
    background: radial-gradient(circle at top, rgba(47, 150, 238, 0.16), #0d1220 80%);
}
</style>
