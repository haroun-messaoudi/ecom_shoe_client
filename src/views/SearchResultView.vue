<script setup>
import { debounce } from 'lodash'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductGrid from '@/components/ProductGrid.vue'
import PriceFilterModal from '@/components/PriceFilterModal.vue'
import { useSearchStore } from '@/stores/search'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

const currentPage = ref(1)
const pageSize = 12
const pageTransitioning = ref(false)
const showFilterModal = ref(false)

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

const totalPages = computed(() => {
  return Math.max(1, Math.ceil((searchStore.count || 0) / pageSize))
})

// Current filters from URL
const currentFilters = computed(() => ({
  ordering: route.query.ordering || '',
  price_min: route.query.price_min ? Number(route.query.price_min) : undefined,
  price_max: route.query.price_max ? Number(route.query.price_max) : undefined,
}))

// Active filters count for display
const activeFiltersCount = computed(() => {
  let count = 0
  if (route.query.ordering) count++
  if (route.query.price_min) count++
  if (route.query.price_max) count++
  return count
})

function buildQuery(cat, searchTerm, page = 1, filters = {}) {
  const q = searchTerm.trim();
  return {
    category: cat.id || undefined,
    search: q || undefined,
    page,
    ordering: filters.ordering || undefined,
    price_min: filters.price_min || undefined,
    price_max: filters.price_max || undefined,
  };
}

function getOptimizedImage(url) {
  if (!url) return ''
  // Only optimize if it's a Cloudinary image
  if (url.includes('res.cloudinary.com')) {
    const parts = url.split('/upload/')
    if (parts.length === 2) {
      // Add Cloudinary transformation for optimization
      return `${parts[0]}/upload/f_auto,q_auto,w_400,h_300,c_fit/${parts[1]}`
    }
  }
  // Return original for non-Cloudinary images
  return url
}

function goToCategory(cat) {
  const query = buildQuery(cat, searchStore.searchTerm, 1, {
    ordering: route.query.ordering,
    price_min: route.query.price_min,
    price_max: route.query.price_max
  });
  router.push({ name: 'products', query });
}

// Handle filter modal
const toggleFilterModal = () => {
  showFilterModal.value = !showFilterModal.value
}

const applyFilters = (filters) => {
  // Update the URL with new filters, reset to page 1
  const query = buildQuery(
    { id: categoryId.value },
    searchStore.searchTerm,
    1,
    filters
  );
  
  router.push({ name: 'products', query });
}

// Clear all filters
const clearAllFilters = () => {
  const query = buildQuery(
    { id: categoryId.value },
    searchStore.searchTerm,
    1,
    {}
  );
  
  router.push({ name: 'products', query });
}

// Remove individual filters
const removeSortFilter = () => {
  const currentFilters = {
    ordering: undefined, // Remove ordering
    price_min: route.query.price_min,
    price_max: route.query.price_max
  }
  
  const query = buildQuery(
    { id: categoryId.value },
    searchStore.searchTerm,
    1,
    currentFilters
  );
  
  router.push({ name: 'products', query });
}

const removePriceFilter = () => {
  const currentFilters = {
    ordering: route.query.ordering,
    price_min: undefined, // Remove price filters
    price_max: undefined
  }
  
  const query = buildQuery(
    { id: categoryId.value },
    searchStore.searchTerm,
    1,
    currentFilters
  );
  
  router.push({ name: 'products', query });
}

const fetchPage = async () => {
  try {
    // Prevent multiple simultaneous calls
    if (pageTransitioning.value) {
      console.log('fetchPage already in progress, skipping')
      return
    }
    
    pageTransitioning.value = true
    searchStore.results = [] // ✅ Clear old results to prevent flicker
    window.scrollTo({ top: 0, behavior: 'smooth' }) // ✅ Bonus scroll to top
    
    // Set filters in store
    searchStore.setFilters({
      ordering: route.query.ordering || null,
      price_min: route.query.price_min ? Number(route.query.price_min) : null,
      price_max: route.query.price_max ? Number(route.query.price_max) : null,
    })
    
    console.log('Calling searchProducts with page:', currentPage.value)
    
    await searchStore.searchProducts({
      page: currentPage.value,
      page_size: pageSize,
    })
  } catch (error) {
    console.error('Error fetching page:', error)
  } finally {
    pageTransitioning.value = false
  }
}

watch(
  () => route.query,
  debounce(async (newQuery, oldQuery) => {
    // Prevent infinite loops by checking if query actually changed
    const newQueryString = JSON.stringify(newQuery)
    const oldQueryString = JSON.stringify(oldQuery)
    
    if (newQueryString === oldQueryString) {
      return
    }
    
    searchStore.setSearchTerm(newQuery.search || '')
    searchStore.setCategory(newQuery.category ? Number(newQuery.category) : null)
    categoryId.value = newQuery.category ? Number(newQuery.category) : null
    
    const page = Number(newQuery.page || 1)
    if (page !== currentPage.value) {
      currentPage.value = page
    }
    searchStore.setPage(page)
    
    await fetchPage()
  }, 300),
  { immediate: true }
)

watch(currentPage, async (newVal, oldVal) => {
  // Prevent infinite loops
  if (newVal === oldVal || newVal === searchStore.page) {
    return
  }
  
  searchStore.setPage(newVal)
  const query = { ...route.query, page: newVal }
  router.replace({ name: route.name, query })
  await fetchPage()
})

watch(() => searchStore.page, (newVal, oldVal) => {
  if (newVal !== currentPage.value && newVal !== oldVal) {
    currentPage.value = newVal
  }
})

onMounted(async () => {
  try {
    if (!searchStore.categories.length) await searchStore.fetchCategories()
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
})

// Expose the toggle function for the navbar
defineExpose({
  toggleFilterModal
})
</script>

<template>
  <div>
    <div class="px-6 py-8 space-y-8">
      <!-- Category Carousel -->
      <div class="pb-4">
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
                v-else-if="cat.image"
                :src="getOptimizedImage(cat.image)"
                :alt="cat.name"
                class="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div v-else class="w-full h-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold text-sm">
                {{ cat.name }}
              </div>
              <div v-if="cat.id !== 0" class="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm">
                {{ cat.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Filters (moved below categories) -->
      <div v-if="activeFiltersCount > 0" class="mb-4">
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap">
          <!-- Sort filter -->
          <div
            v-if="route.query.ordering"
            class="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs border border-orange-200 flex-shrink-0"
          >
            <span>
              {{
                route.query.ordering === 'effective_price' ? 'Cheapest First' :
                route.query.ordering === '-effective_price' ? 'Most Expensive First' :
                'Custom Sort'
              }}
            </span>
            <button @click="removeSortFilter" class="hover:bg-orange-200 rounded-full p-0.5">
              <i class="pi pi-times text-[10px]"></i>
            </button>
          </div>

          <!-- Price filter -->
          <div
            v-if="route.query.price_min || route.query.price_max"
            class="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs border border-orange-200 flex-shrink-0"
          >
            <span>
              ${{ route.query.price_min ? Number(route.query.price_min).toLocaleString() : '5,000' }}
              -
              ${{ route.query.price_max ? Number(route.query.price_max).toLocaleString() : '40,000' }}
            </span>
            <button @click="removePriceFilter" class="hover:bg-orange-200 rounded-full p-0.5">
              <i class="pi pi-times text-[10px]"></i>
            </button>
          </div>

          <!-- Mobile clear-all chip -->
          <button
            @click="clearAllFilters"
            class="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs border border-gray-300 flex-shrink-0"
          >
            <i class="pi pi-times text-[10px]"></i>
            Clear
          </button>
        </div>
      </div>

      <!-- Product Results -->
      <ProductGrid
        :title="[
          'Results',
          currentCategoryName ? 'in ' + currentCategoryName : '',
          searchStore.searchTerm ? `for '${searchStore.searchTerm}'` : ''
        ].filter(Boolean).join(' ')"
        :products="searchStore.results"
        :loading="pageTransitioning || searchStore.loading"
        :error="searchStore.error"
      />

      <!-- No Results -->
      <div
        v-if="!searchStore.loading && !searchStore.error && searchStore.results.length === 0"
        class="text-center text-gray-500 mt-10"
      >
        No products found.
      </div>

      <!-- Pagination -->
      <Transition name="fade">
        <div v-if="!searchStore.loading && totalPages > 1" class="flex justify-center items-center gap-4 mt-10">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-orange-500 text-white rounded-xl shadow transition hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div class="text-sm sm:text-base px-4 py-2 text-gray-700 bg-white border rounded-lg shadow-sm">
            Page <span class="font-semibold">{{ currentPage }}</span> of <span class="font-semibold">{{ totalPages }}</span>
          </div>

          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-orange-500 text-white rounded-xl shadow transition hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </Transition>
    </div>

    <!-- Price Filter Modal -->
    <PriceFilterModal
      :is-open="showFilterModal"
      :current-filters="currentFilters"
      @close="showFilterModal = false"
      @apply-filters="applyFilters"
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>