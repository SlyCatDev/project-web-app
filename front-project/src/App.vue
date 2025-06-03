<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/layout/NavBar.vue'
import FooterSection from '@/components/layout/FooterSection.vue'
import NotificationToast from '@/components/ui/NotificationToast.vue'
</script>

<template>
  <div id="app">
    <header>
      <NavBar />
    </header>
    <main>
      <RouterView />
    </main>
    <FooterSection />
    
    <!-- Notifications globales -->
    <NotificationToast />
  </div>
</template>

<style>
@import '../src/assets/main.css';

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>
