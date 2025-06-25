<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import ProductList from '../components/ProductList.vue'
import { useSearchStore } from '@/stores/search'
import { useProductStore } from '@/stores/products'

const router = useRouter()
const searchStore = useSearchStore()
const productStore = useProductStore()

const categories = ref([])
const activeCategoryId = ref(0)

const recommended = computed(() => productStore.topOrdered.slice(0, 4))
const discounted = computed(() => productStore.discounted.slice(0, 4))
const newProducts = computed(() => productStore.newProducts.slice(0, 4))

const loadingRecommended = computed(() => productStore.loadingTopOrdered)
const loadingDiscounted = computed(() => productStore.loadingDiscounted)
const loadingNewProducts = computed(() => productStore.loadingNewProducts)

function goToCategory(cat) {
  activeCategoryId.value = cat.id
  searchStore.setCategory(cat.id || null)
  router.push({ name: 'products', query: { category: cat.id || '' } })
}

onMounted(async () => {
  await searchStore.fetchCategories()
  categories.value = searchStore.categories
  productStore.fetchTopOrdered()
  productStore.fetchDiscounted()
  productStore.fetchNewProducts()
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-[500px] overflow-hidden flex items-center justify-center text-center mb-10">
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: 'url(/hero.jpeg)' }"
      ></div>
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="relative z-10 text-white space-y-4 px-4">
        <h1 class="text-4xl md:text-5xl font-extrabold">Fuel Your Gains</h1>
        <p class="text-lg max-w-xl mx-auto drop-shadow-md">
          Discover protein powders, pre‑workouts, and recovery shakes.
        </p>
        <button
          @click="$el.querySelector('#productSections')?.scrollIntoView({ behavior: 'smooth' })"
          class="px-8 py-3 bg-[#FF6F00] text-white rounded-full font-medium hover:scale-105 transition"
        >
          Shop Now
        </button>
      </div>
    </section>
    <!-- Category Image Carousel -->
    <section class="w-full px-4 mb-12">
      <h2 class="text-xl font-semibold mb-4 text-center">Shop by Category</h2>
      <div class="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="min-w-[140px] flex-shrink-0 text-center"
        >
          <!-- Image or Fallback (click triggers goToCategory) -->
          <div
            class="relative w-full h-28 rounded-lg overflow-hidden cursor-pointer group"
            @click="goToCategory(cat)"
          >
            <!-- If category has an image -->
            <img
              v-if="cat.image"
              :src="cat.image"
              :alt="cat.name"
              class="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <!-- Fallback background -->
            <div
              v-else
              class="w-full h-full bg-orange-100 flex items-center justify-center text-orange-700"
            >
              {{ cat.name }}
            </div>

            <!-- Text overlay -->
            <div
              class="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm"
            >
              {{ cat.name }}
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Main Content -->
    <main class="px-6 py-12 space-y-20">
      <!-- Product Sections -->
      <section id="productSections" class="space-y-16">
        <ProductList title="Recommended for You" :products="recommended" :loading="loadingRecommended" />
        <ProductList title="Products on Sale" :products="discounted" :loading="loadingDiscounted" />
        <ProductList title="New Arrivals" :products="newProducts" :loading="loadingNewProducts" />
      </section>

      <!-- Footer -->
      <footer class="text-center text-sm text-gray-500 space-x-6">
        <router-link to="/about" class="hover:underline">About</router-link>
        <router-link to="/contact" class="hover:underline">Contact</router-link>
        <router-link to="/privacy" class="hover:underline">Privacy Policy</router-link>
      </footer>
    </main>
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
