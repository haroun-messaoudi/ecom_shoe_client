<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import ToastContainer from 'vue3-toastify'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  console.log('App.vue mounted')
  
  // Add navigation debugging
  router.beforeEach((to, from, next) => {
    console.log('Navigation from:', from.path, 'to:', to.path)
    next()
  })
  
  router.afterEach((to) => {
    console.log('Navigation completed to:', to.path)
  })
})
</script>

<template>
  <div>
    <ToastContainer />
    <NavBar />

    <!-- Router view without transition to test navigation -->
    <RouterView v-slot="{ Component, route }">
      <component :is="Component" :key="route.fullPath" />
    </RouterView>
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
