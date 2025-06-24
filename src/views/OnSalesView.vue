<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useProductStore } from '@/stores/products'
import ProductGrid from '@/components/ProductGrid.vue'

const productStore = useProductStore()
const currentPage = ref(1)
const pageSize = 8

const totalPages = computed(() => {
  return Math.ceil(productStore.discountedCount / pageSize)
})

const fetchPage = () => {
  productStore.fetchDiscounted({
    page: currentPage.value,
    page_size: pageSize
  })
}

onMounted(fetchPage)
watch(currentPage, fetchPage)
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 py-8">
    <h2 class="text-2xl font-semibold mb-6">On Sale</h2>

    <div v-if="productStore.loading" class="flex flex-col items-center justify-center py-20 text-gray-600 space-y-4">
      <svg class="animate-spin h-8 w-8 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
      <p class="text-lg font-medium">Loading Products On Sale…</p>
    </div>

    <div v-else-if="productStore.error" class="text-center text-red-500 py-10">
      {{ productStore.error }}
    </div>

    <ProductGrid
      v-else
      :products="productStore.discounted"
      :loading="productStore.loading"
      :error="productStore.error"
    />

    <div
      v-if="!productStore.loading && !productStore.error && productStore.discounted.length === 0"
      class="text-center text-gray-500 mt-10"
    >
      No discounted products found.
    </div>

    <div class="flex justify-center mt-8" v-if="totalPages > 1">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="px-4 py-2 border rounded-l disabled:opacity-50"
      >
        Previous
      </button>

      <span class="px-4 py-2 border-t border-b">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 border rounded-r disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>
