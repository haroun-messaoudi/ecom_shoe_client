<!-- src/views/ProductDetail.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ProductDetailHolder from '@/components/ProductDetailHolder.vue'

const route     = useRoute()
const productId = route.params.id

const product = ref(null)
const loading = ref(true)
const error   = ref('')

// Fetch the product detail on mount
onMounted(async () => {
  loading.value = true
  error.value   = ''
  try {
    const res = await axios.get(`https://ecom-1qve.onrender.com/api/products/${productId}`)
    product.value = res.data
  } catch (e) {
    console.error('Error fetching product:', e)
    error.value = 'Failed to load product details.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 py-8">
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-gray-600 space-y-4">
      <svg class="animate-spin h-8 w-8 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
      <p class="text-lg font-medium">Loading product details…</p>
    </div>
    <div v-else-if="error" class="text-center py-20 text-red-500">
      {{ error }}
    </div>
    <ProductDetailHolder
      v-else
      :product="product"
    />
  </div>
</template>
