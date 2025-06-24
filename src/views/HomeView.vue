<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import ProductList from '../components/ProductList.vue'
import { useSearchStore } from '@/stores/search'
import { useProductStore } from '@/stores/products'

const router = useRouter()
const searchStore = useSearchStore()
const productStore = useProductStore()

const categories = ref([{ id: 0, name: 'All' }])
const activeCategoryId = ref(0)

const recommended = computed(() => productStore.topOrdered.slice(0, 4)) // Most ordered
const discounted = computed(() => productStore.discounted.slice(0, 4))  // Sales
const newProducts = computed(() => productStore.newProducts.slice(0, 4)) // New

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
  categories.value = [{ id: 0, name: 'All' }, ...searchStore.categories]

  productStore.fetchTopOrdered()
  productStore.fetchDiscounted()
  productStore.fetchNewProducts()
})
</script>

<template>
  <main class="px-6 py-12 space-y-20">
    <!-- Hero -->
    <section class="text-center bg-gray-100 py-20 rounded-xl">
      <h1 class="text-4xl md:text-5xl font-extrabold mb-6">Welcome to Your Store</h1>
      <button
        @click="$el.querySelector('#productSections')?.scrollIntoView({ behavior: 'smooth' })"
        class="px-8 py-3 bg-orange-500 text-white rounded-full font-medium hover:scale-105 transition"
      >
        Shop Now
      </button>
    </section>

    <!-- Category Filter -->
    <div class="flex flex-wrap justify-center gap-3 mt-4 px-4">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="goToCategory(cat)"
        class="px-4 py-2 rounded-full border text-sm font-medium transition duration-200 min-w-[100px] text-center"
        :class="{
          'bg-orange-500 text-white border-orange-500 shadow-md': cat.id === activeCategoryId,
          'bg-white text-gray-700 border-orange-300 hover:bg-orange-100 active:bg-orange-200': cat.id !== activeCategoryId
        }"
      >
        {{ cat.name }}
      </button>
    </div>

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
</template>
