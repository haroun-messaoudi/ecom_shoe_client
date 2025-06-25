<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import ToastContainer from 'vue3-toastify'
</script>

<template>
  <div>
    <ToastContainer />
    <NavBar />

    <!-- Smooth fade transition between pages -->
    <transition name="fade" mode="out-in" appear>
      <RouterView :key="$route.fullPath" />
    </transition>
  </div>
</template>

<style>
/* Fade transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>
