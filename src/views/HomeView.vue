<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMotion } from '@vueuse/motion'
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

// Intersection Observer Setup Function
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up')
      }
    })
  }, { threshold: 0.2 })

  nextTick(() => {
    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el))
  })
}

onMounted(async () => {
  await searchStore.fetchCategories()
  categories.value = searchStore.categories
  productStore.fetchTopOrdered()
  productStore.fetchDiscounted()
  productStore.fetchNewProducts()

  setupScrollAnimations()
})

// 👀 Re-run scroll animation setup after loading completes
watch(
  () => [
    loadingRecommended.value,
    loadingDiscounted.value,
    loadingNewProducts.value
  ],
  ([l1, l2, l3]) => {
    if (!l1 && !l2 && !l3) {
      setupScrollAnimations()
    }
  }
)
</script>
<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-[500px] overflow-hidden flex items-center justify-center text-center mb-10">
      <div class="absolute inset-0 bg-cover bg-center scale-110 transition-all duration-1000"
           :style="{ backgroundImage: 'url(/hero.jpeg)' }"></div>
      <div class="absolute inset-0 bg-black/50"></div>
      <div
        class="relative z-10 text-white space-y-4 px-4"
        v-motion
        :initial="{ y: 30, opacity: 0 }"
        :enter="{ y: 0, opacity: 1, transition: { duration: 800 } }"
      >
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
      <div class="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="min-w-[140px] snap-start flex-shrink-0 text-center scroll-animate opacity-0 translate-y-4"
        >
          <div
            class="relative w-full h-28 rounded-lg overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-shadow"
            @click="goToCategory(cat)"
          >
            <img
              v-if="cat.image"
              :src="cat.image"
              :alt="cat.name"
              class="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div
              v-else
              class="w-full h-full bg-orange-100 flex items-center justify-center text-orange-700"
            >
              {{ cat.name }}
            </div>
            <div
              class="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm"
            >
              {{ cat.name }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content with Animate on Scroll -->
    <main class="px-6 py-12 space-y-20">
      <section id="productSections" class="space-y-20">
        <div class="scroll-animate opacity-0 translate-y-8">
          <ProductList title="Recommended for You" :products="recommended" :loading="loadingRecommended" />
        </div>
        <div class="scroll-animate opacity-0 translate-y-8">
          <ProductList title="Products on Sale" :products="discounted" :loading="loadingDiscounted" />
        </div>
        <div class="scroll-animate opacity-0 translate-y-8">
          <ProductList title="New Arrivals" :products="newProducts" :loading="loadingNewProducts" />
        </div>
      </section>

      <!-- Footer -->
      <!-- <footer class="text-center text-sm text-gray-500 space-x-6">
        <router-link to="/about" class="hover:underline">About</router-link>
        <router-link to="/contact" class="hover:underline">Contact</router-link>
        <router-link to="/privacy" class="hover:underline">Privacy Policy</router-link>
      </footer> -->
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

/* Fade in + move up effect */
.fade-in-up {
  opacity: 1 !important;
  transform: translateY(0) !important;
  transition: all 0.6s ease-out;
}
.scroll-animate {
  opacity: 0;
  transform: translateY(30px);
}
</style>
