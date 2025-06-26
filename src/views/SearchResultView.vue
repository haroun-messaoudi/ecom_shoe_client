<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductGrid from '../components/ProductGrid.vue'
import { useSearchStore } from '@/stores/search'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

const categoryId = ref(route.query.category ? Number(route.query.category) : null)

const categories = computed(() => [
  { id: 0, name: 'All', image: null },
  ...searchStore.categories
])

const currentCategoryName = computed(() => {
  if (!categoryId.value || categoryId.value === 0) return ''
  const cat = searchStore.categories.find(c => c.id === categoryId.value)
  return cat ? cat.name : ''
})

function goToCategory(cat) {
  const q = searchStore.searchTerm.trim()
  const query = { category: cat.id || undefined }
  if (q) query.search = q
  router.push({ name: 'products', query })
}

watch(
  () => route.query,
  async q => {
    searchStore.setSearchTerm(q.search || '')
    searchStore.setCategory(q.category ? Number(q.category) : null)
    categoryId.value = q.category ? Number(q.category) : null
    await searchStore.searchProducts()
  },
  { immediate: true }
)

onMounted(async () => {
  await searchStore.fetchCategories()
})
</script>

<template>
  <div class="px-6 py-8 space-y-8">
    <!-- Category Image Carousel -->
    <div class="mb-6">
      <div class="flex gap-4 overflow-x-auto no-scrollbar pb-1">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="min-w-[120px] flex-shrink-0"
        >
          <div
            class="relative w-full h-24 rounded-lg overflow-hidden cursor-pointer group border-2 transition"
            :class="{
              'border-orange-500 shadow-md': cat.id === categoryId,
              'border-transparent': cat.id !== categoryId
            }"
            @click="goToCategory(cat)"
          >
            <div v-if="cat.id === 0" class="w-full h-full relative bg-gray-400 text-orange-700 font-semibold text-sm flex items-center justify-center">
                <!-- Minimal Grid SVG Icon for 'All' -->
                <svg class="w-9 h-9 text-white opacity-90" fill="none" viewBox="0 0 28 28" stroke="currentColor" stroke-width="1.5">
                  <rect x="4" y="4" width="6" height="6" rx="2" fill="currentColor" />
                  <rect x="4" y="14" width="6" height="6" rx="2" fill="currentColor" />
                  <rect x="14" y="4" width="6" height="6" rx="2" fill="currentColor" />
                  <rect x="14" y="14" width="6" height="6" rx="2" fill="currentColor" />
                </svg>
                <div class="absolute inset-0 flex items-end justify-center pb-2">
                  <span class="text-white font-semibold text-base drop-shadow">All</span>
                </div>
            </div>
            <img
              v-if="cat.image"
              :src="cat.image"
              :alt="cat.name"
              class="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div
              v-else
              class="w-full h-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold text-sm"
            >
              {{ cat.name }}
            </div>
            <div
              v-if="cat.id !== 0"
              class="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm"
            >
              {{ cat.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div
      v-if="searchStore.loading"
      class="flex flex-col items-center justify-center py-20 text-gray-600 space-y-4"
    >
      <svg
        class="animate-spin h-8 w-8 text-orange-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p class="text-lg font-medium">Searching...</p>
    </div>

    <!-- Product Results -->
    <ProductGrid
      v-else
      :title="[
        'Results',
        currentCategoryName ? 'in ' + currentCategoryName : '',
        searchStore.searchTerm ? `for '${searchStore.searchTerm}'` : ''
      ].filter(Boolean).join(' ')"
      :products="searchStore.results"
      :loading="false"
      :error="searchStore.error"
    />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
