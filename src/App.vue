<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import ToastContainer from 'vue3-toastify'
import { onMounted, ref, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Ref to access the current page component
const currentPageRef = ref(null)

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

// Handle filter toggle from navbar
const handleToggleFilters = async () => {
  console.log('handleToggleFilters called')
  
  // Wait for the next tick to ensure the component is rendered
  await nextTick()
  
  // Check if we're on the search results page and the component has the method
  if (route.name === 'products' && currentPageRef.value?.toggleFilterModal) {
    console.log('Toggling filter modal')
    currentPageRef.value.toggleFilterModal()
  } else {
    console.log('Cannot toggle filters:', {
      routeName: route.name,
      hasToggleMethod: !!currentPageRef.value?.toggleFilterModal,
      componentRef: currentPageRef.value
    })
  }
}
</script>

<template>
  <div>
    <ToastContainer />
    <NavBar @toggle-filters="handleToggleFilters" />
     
    <!-- Router view with ref to access current component -->
    <RouterView v-slot="{ Component, route }">
    <Transition name="fade" mode="out-in">
      <component 
        :is="Component" 
        :key="route.fullPath" 
        ref="currentPageRef"
      />
    </Transition>
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