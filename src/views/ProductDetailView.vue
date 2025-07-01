<!-- src/views/ProductDetail.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ProductDetailHolder from '@/components/ProductDetailHolder.vue'

const route     = useRoute()
const productId = route.params.id

// Use product from router state if available
const initialProduct = history.state?.product || null

const product = ref(initialProduct)
const loading = ref(!initialProduct)
const error   = ref('')
const loadingExtras = ref(true)

// Fetch the product detail on mount
onMounted(async () => {
  // If no initial product (e.g., direct link), fetch main info
  if (!product.value) {
    loading.value = true
    error.value   = ''
    try {
      const res = await axios.get(`https://ecom-shoe-b2nx.onrender.com/api/products/${productId}`)
      product.value = res.data
    } catch (e) {
      console.error('Error fetching product:', e)
      error.value = 'Failed to load product details.'
    } finally {
      loading.value = false
    }
  }

  // Fetch images and variants (extras)
  try {
    const res = await axios.get(`https://ecom-shoe-b2nx.onrender.com/api/products/${productId}/extras/`)
    product.value = {
      ...product.value,
      images: res.data.images,
      variants: res.data.variants,
    }
  } catch (e) {
    error.value = 'Failed to load product images/variants.'
  } finally {
    loadingExtras.value = false
  }
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 py-8">
    <div v-if="loading" class="flex flex-col lg:flex-row gap-10 animate-pulse">
      <!-- Image Placeholder -->
      <div class="flex-1">
        <div class="w-full h-[500px] bg-gray-200 rounded-xl shadow-inner"></div>
      </div>

      <!-- Details Placeholder -->
      <div class="flex-1 space-y-4">
        <!-- Title -->
        <div class="h-10 bg-gray-300 rounded w-3/4"></div>

        <!-- Description lines -->
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        <div class="h-4 bg-gray-200 rounded w-4/6"></div>

        <!-- Price -->
        <div class="h-8 bg-gray-300 rounded w-40 mt-4"></div>

        <!-- Stock Info -->
        <div class="h-4 bg-gray-200 rounded w-32"></div>
        <!-- Size Buttons -->
        <div>
          <div class="h-5 bg-gray-200 rounded w-20 mb-2"></div>
          <div class="flex gap-2">
            <div class="w-16 h-10 bg-gray-300 rounded-md"></div>
            <div class="w-16 h-10 bg-gray-300 rounded-md"></div>
            <div class="w-16 h-10 bg-gray-300 rounded-md"></div>
          </div>
        </div>

        <!-- Quantity & Button -->
        <div class="pt-4 flex items-center gap-4 flex-wrap">
          <div class="w-28 h-10 bg-gray-300 rounded-md"></div>
          <div class="w-36 h-12 bg-orange-300 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- ✅ Product Detail Display -->
    <ProductDetailHolder v-else :product="product" :loading-extras="loadingExtras" />
  </div>
</template>

