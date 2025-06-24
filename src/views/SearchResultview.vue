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
  { id: 0, name: 'All' },
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

    // ✅ Always fetch products, even if no filters are applied
    await searchStore.searchProducts()
  },
  { immediate: true }
)

onMounted(async () => {
  await searchStore.fetchCategories()
  // initial product fetch handled by watcher
})
</script>

<template>
  <div class="px-6 py-8 space-y-8">
    <!-- Category Filter Bar -->
    <div class="flex flex-wrap justify-center gap-3 px-2">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="goToCategory(cat)"
        class="px-4 py-2 rounded-full border text-sm font-medium transition duration-200 min-w-[100px] text-center"
        :class="{
          'bg-orange-500 text-white border-orange-500 shadow-md': cat.id === categoryId,
          'bg-white text-gray-700 border-orange-300 hover:bg-orange-100 active:bg-orange-200': cat.id !== categoryId
        }"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Results -->
    <div v-if="searchStore.loading" class="flex flex-col items-center justify-center py-20 text-gray-600 space-y-4">
      <svg class="animate-spin h-8 w-8 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
      <p class="text-lg font-medium">Searching...</p>
    </div>

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
