<script setup>
import { ref, computed, watch } from 'vue'
import Slider from 'primevue/slider'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  currentFilters: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'apply-filters'])

// Local filter state - combined price range
const sortOption = ref(props.currentFilters.ordering || '')
const priceRange = ref([
  props.currentFilters.price_min || 5000,
  props.currentFilters.price_max || 40000
])

// Simplified sort options
const sortOptions = [
  { value: '', label: 'Default', icon: 'pi-sort-alt', description: 'Most relevant' },
  { value: 'effective_price', label: 'Cheapest', icon: 'pi-sort-amount-up-alt', description: 'Low to high' },
  { value: '-effective_price', label: 'Most Expensive', icon: 'pi-sort-amount-down', description: 'High to low' }
]

// Watch for prop changes to update local state
watch(() => props.currentFilters, (newFilters) => {
  sortOption.value = newFilters.ordering || ''
  priceRange.value = [
    newFilters.price_min || 5000,
    newFilters.price_max || 40000
  ]
}, { deep: true })

// Computed price range display
const priceRangeText = computed(() => {
  return `${priceRange.value[0].toLocaleString()}DA - ${priceRange.value[1].toLocaleString()}DA`
})

// Apply filters
const applyFilters = () => {
  const filters = {
    ordering: sortOption.value || undefined,
    price_min: priceRange.value[0] !== 5000 ? priceRange.value[0] : undefined,
    price_max: priceRange.value[1] !== 40000 ? priceRange.value[1] : undefined
  }
  emit('apply-filters', filters)
  emit('close')
}

// Reset filters
const resetFilters = () => {
  sortOption.value = ''
  priceRange.value = [5000, 40000]
}

// Close modal
const closeModal = () => {
  emit('close')
}

// Check if filters are active
const hasActiveFilters = computed(() => {
  return sortOption.value !== '' || 
         priceRange.value[0] !== 5000 || 
         priceRange.value[1] !== 40000
})
function snapPriceRange() {
  priceRange.value = priceRange.value.map(v => Math.round(v / 1000) * 1000)
}
</script>

<template>
  <!-- Backdrop -->
  <Transition name="backdrop">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
      @click="closeModal"
    >
      <!-- Modal -->
      <Transition name="modal">
        <div
          v-if="isOpen"
          class="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-md transform"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Filter Products</h2>
              <p v-if="hasActiveFilters" class="text-sm text-orange-600 mt-1">Filters active</p>
            </div>
            <button
              @click="closeModal"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <i class="pi pi-times text-gray-500"></i>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-8">
            <!-- Sort Options - Simplified -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-4">Sort By</label>
              <div class="grid gap-3">
                <label
                  v-for="option in sortOptions"
                  :key="option.value"
                  class="group flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-200"
                  :class="{ 
                    'border-orange-500 bg-orange-50 shadow-sm': sortOption === option.value,
                    'hover:border-gray-300': sortOption !== option.value
                  }"
                >
                  <input
                    v-model="sortOption"
                    type="radio"
                    :value="option.value"
                    class="sr-only"
                  />
                  
                  <!-- Icon -->
                  <div class="flex items-center justify-center w-10 h-10 rounded-lg mr-3"
                       :class="sortOption === option.value ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'"
                  >
                    <i :class="`pi ${option.icon} text-sm`"></i>
                  </div>
                  
                  <!-- Content -->
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">{{ option.label }}</div>
                    <div class="text-sm text-gray-500">{{ option.description }}</div>
                  </div>
                  
                  <!-- Radio indicator -->
                  <div
                    class="w-5 h-5 border-2 rounded-full flex items-center justify-center ml-3"
                    :class="sortOption === option.value ? 'border-orange-500' : 'border-gray-300'"
                  >
                    <div
                      v-if="sortOption === option.value"
                      class="w-2.5 h-2.5 bg-orange-500 rounded-full"
                    ></div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Price Range - PrimeVue Slider -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-4">
                Price Range: {{ priceRangeText }}
              </label>
              
              <!-- PrimeVue Dual Range Slider -->
              <div class="px-2 py-6">
                <Slider 
                  v-model="priceRange" 
                  :min="5000" 
                  :max="40000" 
                  :step="1000"
                  range
                  class="w-full"
                  @change="snapPriceRange"
                />
              </div>
              
              <!-- Current values display -->
              <div class="flex justify-between text-sm text-gray-600 mb-2">
                <span>Min: {{ priceRange[0].toLocaleString() }}DA</span>
                <span>Max: {{ priceRange[1].toLocaleString() }}DA</span>
              </div>
              
              <!-- Range Labels -->
              <div class="flex justify-between text-sm text-gray-500 mt-2">
                <span>5,000DA</span>
                <span>40,000DA</span>
              </div>

              <!-- Quick preset buttons -->
              <div class="flex gap-2 mt-4">
                <button
                  @click="priceRange = [5000, 15000]"
                  class="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  :class="{ 'bg-orange-100 text-orange-700': priceRange[0] === 5000 && priceRange[1] === 15000 }"
                >
                  Budget
                </button>
                <button
                  @click="priceRange = [15000, 25000]"
                  class="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  :class="{ 'bg-orange-100 text-orange-700': priceRange[0] === 15000 && priceRange[1] === 25000 }"
                >
                  Mid-range
                </button>
                <button
                  @click="priceRange = [25000, 40000]"
                  class="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  :class="{ 'bg-orange-100 text-orange-700': priceRange[0] === 25000 && priceRange[1] === 40000 }"
                >
                  Premium
                </button>
                <button
                  @click="priceRange = [15000, 22000]"
                  class="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  :class="{ 'bg-orange-100 text-orange-700': priceRange[0] === 15000 && priceRange[1] === 22000 }"
                >
                  Test 15-22k
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex gap-3 p-6 border-t border-gray-200">
            <button
              @click="resetFilters"
              class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              :class="{ 'opacity-50 cursor-not-allowed': !hasActiveFilters }"
              :disabled="!hasActiveFilters"
            >
              Reset
            </button>
            <button
              @click="applyFilters"
              class="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* PrimeVue Slider customization */
:deep(.p-slider) {
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
}

:deep(.p-slider-range) {
  background: #f97316;
  border-radius: 4px;
}

:deep(.p-slider-handle) {
  background: #f97316;
  border: 3px solid white;
  width: 20px;
  height: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
}

:deep(.p-slider-handle:focus) {
  outline: none;
  box-shadow: 0 0 0 2px #fed7aa;
}

/* Transitions */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.modal-enter-active {
  transition: all 0.3s ease;
}

.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.modal-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (min-width: 768px) {
  .modal-enter-from,
  .modal-leave-to {
    transform: translateY(20px) scale(0.95);
  }
}
</style>