<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import ProductDetailHolder from '@/components/ProductDetailHolder.vue'
import SimilarProductsGrid from '@/components/SimilarProductsGrid.vue'

const route = useRoute()
const productId = ref(route.params.id)

const product = ref(null)
const similarProducts = ref([])
const loading = ref(true)
const error = ref('')
const loadingExtras = ref(true)

// Reset all state when component mounts or route changes
function resetState() {
  product.value = null
  similarProducts.value = []
  loading.value = true
  error.value = ''
  loadingExtras.value = true
}

async function fetchProductDetails() {
  try {
    const res = await axios.get(`https://ecom-shoe-no8p.onrender.com/api/products/${productId.value}/`)
    product.value = res.data
    console.log('Product details fetched:', product.value)
  } catch (e) {
    console.error('Error fetching product:', e)
    error.value = 'Failed to load product details.'
  } finally {
    loading.value = false
  }
}

async function fetchProductVariants() {
  try {
    const res = await axios.get(`https://ecom-shoe-no8p.onrender.com/api/products/${productId.value}/variants/`)
    if (product.value) {
      product.value.variants = res.data.variants
    }
  } catch (e) {
    console.warn('Variants fetch failed:', e)
  } finally {
    loadingExtras.value = false
  }
}

async function fetchSimilarProducts() {
  try {
    const res = await axios.get(`https://ecom-shoe-no8p.onrender.com/api/products/${productId.value}/similar/`)
    
    // Filter out current product and randomly pick 4
    const filtered = res.data.filter(p => p.id !== parseInt(productId.value))
    const selected = filtered.sort(() => 0.5 - Math.random()).slice(0, 4)
    
    // Add `image` field to each product for compatibility with ProductCard
    similarProducts.value = selected.map(product => ({
      ...product,
      image: product.main_image_url
    }))
    
  } catch (e) {
    console.warn('Could not load similar products:', e)
  }
}

async function loadProductData() {
  resetState()
  await fetchProductDetails()
  if (product.value) {
    await fetchProductVariants()
    await fetchSimilarProducts()
  }
}

// Watch for route changes
watch(() => route.params.id, (newId) => {
  console.log('Route changed to product ID:', newId)
  if (newId && newId !== productId.value) {
    productId.value = newId
    loadProductData()
  }
}, { immediate: false })

onMounted(async () => {
  console.log('ProductDetailView mounted with ID:', productId.value)
  await loadProductData()
})
</script>

<template>
  <!-- Responsive Container with Better Breakpoints -->
  <div class="w-full min-h-screen bg-gray-50/30">
    <div class="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-12">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 animate-pulse">
        <!-- Image Placeholder -->
        <div class="flex-1 lg:max-w-2xl">
          <div class="w-full h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px] bg-gray-200 rounded-2xl shadow-inner"></div>
        </div>
        
        <!-- Details Placeholder -->
        <div class="flex-1 lg:max-w-xl xl:max-w-2xl space-y-4 lg:space-y-6">
          <div class="h-8 lg:h-12 bg-gray-300 rounded w-3/4"></div>
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div class="h-8 lg:h-10 bg-gray-300 rounded w-40 mt-6"></div>
          <div class="h-4 bg-gray-200 rounded w-32"></div>
          <div>
            <div class="h-5 bg-gray-200 rounded w-20 mb-3"></div>
            <div class="flex gap-3">
              <div class="w-16 h-10 lg:w-20 lg:h-12 bg-gray-300 rounded-md"></div>
              <div class="w-16 h-10 lg:w-20 lg:h-12 bg-gray-300 rounded-md"></div>
              <div class="w-16 h-10 lg:w-20 lg:h-12 bg-gray-300 rounded-md"></div>
            </div>
          </div>
          <div class="pt-6 flex items-center gap-4 flex-wrap">
            <div class="w-32 h-10 lg:w-36 lg:h-12 bg-gray-300 rounded-md"></div>
            <div class="w-40 h-12 lg:w-44 lg:h-14 bg-orange-300 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Product Content -->
      <div v-else-if="product" class="space-y-16 lg:space-y-20 xl:space-y-24">
        <ProductDetailHolder
          :product="product"
          :loading-extras="loadingExtras"
        />

        <!-- Similar Products Section - Properly Centered for Large Screens -->
        <div v-if="similarProducts.length > 0" class="flex justify-center w-full">
            <div class="relative w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl">
            <!-- Background Pattern for Visual Interest -->
            <div class="absolute inset-0 opacity-30">
              <div class="absolute top-0 left-1/4 w-2 h-2 bg-orange-200 rounded-full"></div>
              <div class="absolute top-12 right-1/3 w-1 h-1 bg-orange-300 rounded-full"></div>
              <div class="absolute bottom-12 left-1/5 w-1.5 h-1.5 bg-orange-200 rounded-full"></div>
            </div>

            <!-- Section Header with Enhanced Design -->
            <div class="relative pb-12 lg:pb-16 text-center">
              <!-- Decorative Line with Center Element -->
              <div class="flex items-center justify-center mb-8 lg:mb-10">
                <div class="flex-1 max-w-24 lg:max-w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-400"></div>
                <div class="px-6 lg:px-8">
                  <div class="relative">
                    <div class="w-3 h-3 lg:w-4 lg:h-4 bg-orange-400 rounded-full"></div>
                    <div class="absolute inset-0 w-3 h-3 lg:w-4 lg:h-4 bg-orange-300 rounded-full animate-ping opacity-20"></div>
                  </div>
                </div>
                <div class="flex-1 max-w-24 lg:max-w-32 h-px bg-gradient-to-r from-gray-400 via-gray-300 to-transparent"></div>
              </div>
              
              <!-- Main Title -->
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
                <span class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  You Might Also Like
                </span>
              </h2>
              
              <!-- Subtitle -->
              <div class="flex justify-center">
                <p class="text-gray-600 text-base text-center sm:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed">
                  Discover similar products that match your style and preferences
                </p>
              </div>
            </div>
            
            <!-- Products Grid - Centered and Constrained -->
            <div class="similar-products-wrapper">
              <SimilarProductsGrid :products="similarProducts" :show-title="false" />
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Error State -->
      <div v-else class="text-center py-20 lg:py-32">
        <div class="max-w-md mx-auto">
          <!-- Error Icon with Animation -->
          <div class="text-red-400 mb-6">
            <div class="relative inline-block">
              <svg class="w-20 h-20 lg:w-24 lg:h-24 mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="absolute inset-0 w-20 h-20 lg:w-24 lg:h-24 mx-auto border-2 border-red-200 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          
          <!-- Error Content -->
          <h3 class="text-2xl lg:text-3xl font-semibold text-gray-800 mb-3">Product Not Found</h3>
          <p class="text-gray-600 text-lg mb-8 leading-relaxed">{{ error || 'The product you are looking for does not exist or has been removed.' }}</p>
          
          <!-- Action Button -->
          <router-link
            to="/products"
            class="inline-flex items-center gap-3 px-8 py-4 lg:px-10 lg:py-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Browse All Products</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Enhanced animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

.slide-in-left {
  animation: slideInFromLeft 0.6s ease-out;
}

/* Responsive improvements */
@media (min-width: 1536px) {
  .similar-products-wrapper {
    transform: scale(1.02);
    transform-origin: center;
  }
}

/* Better focus states for large screens */
@media (min-width: 1024px) {
  button:focus-visible,
  a:focus-visible {
    outline: 3px solid #f97316;
    outline-offset: 3px;
  }
}

</style>