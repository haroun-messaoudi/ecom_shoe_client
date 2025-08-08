<template>
  <div class="mt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div class="hidden sm:flex items-center gap-2">
        <button
          @click="scrollLeft"
          :disabled="!canScrollLeft"
          class="p-2 rounded-full bg-white border border-gray-200 hover:border-orange-400 hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Scroll left"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          @click="scrollRight"
          :disabled="!canScrollRight"
          class="p-2 rounded-full bg-white border border-gray-200 hover:border-orange-400 hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Scroll right"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile: Horizontal scroll -->
    <div class="sm:hidden">
      <div
        ref="mobileScrollContainer"
        @scroll="updateScrollState"
        class="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style="scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="flex-shrink-0 w-64"
          style="scroll-snap-align: start;"
        >
          <router-link
            :to="`/product/${product.id}`"
            class="block transform hover:scale-105 transition-transform duration-200"
          >
            <ProductCard :product="product" />
          </router-link>
        </div>
      </div>
      
      <!-- Mobile scroll indicators -->
      <div class="flex justify-center mt-4 gap-1">
        <div
          v-for="(_, index) in products"
          :key="index"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="index === currentMobileIndex ? 'w-8 bg-orange-400' : 'w-1.5 bg-gray-300'"
        ></div>
      </div>
    </div>

    <!-- Desktop/Tablet: Grid with horizontal scroll -->
    <div class="hidden sm:block relative">
      <div
        ref="desktopScrollContainer"
        @scroll="updateScrollState"
        class="overflow-x-auto scrollbar-hide"
        style="-webkit-overflow-scrolling: touch;"
      >
        <div class="flex gap-6 pb-2" style="width: max-content;">
          <div
            v-for="product in products"
            :key="product.id"
            class="flex-shrink-0 w-72"
          >
            <router-link
              :to="`/product/${product.id}`"
              class="block transform hover:scale-105 transition-transform duration-200"
            >
              <ProductCard :product="product" />
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="products.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <p class="text-gray-500 text-lg">No similar products found</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'

const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  }
})

const mobileScrollContainer = ref(null)
const desktopScrollContainer = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)
const currentMobileIndex = ref(0)

const scrollLeft = () => {
  const container = desktopScrollContainer.value
  if (container) {
    container.scrollBy({ left: -300, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  const container = desktopScrollContainer.value
  if (container) {
    container.scrollBy({ left: 300, behavior: 'smooth' })
  }
}

const updateScrollState = () => {
  // Update desktop scroll state
  const desktopContainer = desktopScrollContainer.value
  if (desktopContainer) {
    canScrollLeft.value = desktopContainer.scrollLeft > 0
    canScrollRight.value = 
      desktopContainer.scrollLeft < 
      desktopContainer.scrollWidth - desktopContainer.clientWidth - 1
  }

  // Update mobile scroll indicators
  const mobileContainer = mobileScrollContainer.value
  if (mobileContainer && props.products?.length > 0) {
    const scrollProgress = mobileContainer.scrollLeft / (mobileContainer.scrollWidth - mobileContainer.clientWidth)
    const totalItems = props.products.length
    currentMobileIndex.value = Math.round(scrollProgress * Math.max(0, totalItems - 1))
  }
}

let scrollTimeout = null
const handleScroll = () => {
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(updateScrollState, 100)
}

onMounted(() => {
  updateScrollState()
  
  // Add scroll listeners with proper error handling
  if (desktopScrollContainer.value) {
    try {
      desktopScrollContainer.value.addEventListener('scroll', handleScroll, { passive: true })
    } catch (e) {
      console.warn('Failed to add desktop scroll listener:', e)
    }
  }
  if (mobileScrollContainer.value) {
    try {
      mobileScrollContainer.value.addEventListener('scroll', handleScroll, { passive: true })
    } catch (e) {
      console.warn('Failed to add mobile scroll listener:', e)
    }
  }
})

onUnmounted(() => {
  // Clear timeout first
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
    scrollTimeout = null
  }
  
  // Clean up scroll listeners with proper error handling
  if (desktopScrollContainer.value) {
    try {
      desktopScrollContainer.value.removeEventListener('scroll', handleScroll)
    } catch (e) {
      console.warn('Failed to remove desktop scroll listener:', e)
    }
  }
  if (mobileScrollContainer.value) {
    try {
      mobileScrollContainer.value.removeEventListener('scroll', handleScroll)
    } catch (e) {
      console.warn('Failed to remove mobile scroll listener:', e)
    }
  }
})
</script>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Smooth momentum scrolling on iOS */
.scrollbar-hide {
  -webkit-overflow-scrolling: touch;
}

/* Focus styles for accessibility */
button:focus-visible {
  outline: 2px solid #f97316;
  outline-offset: 2px;
}
</style>