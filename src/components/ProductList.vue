<script setup>
import { ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  title: { type: String, required: true },
  products: { type: Array, required: true },
})

const scrollRef = ref(null)

const scrollLeft = () => {
  scrollRef.value?.scrollBy({ left: -300, behavior: 'smooth' })
}
const scrollRight = () => {
  scrollRef.value?.scrollBy({ left: 300, behavior: 'smooth' })
}
</script>

<template>
  <div class="relative w-full">
    <!-- Arrows -->
    <button
      @click="scrollLeft"
      class="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-2 rounded-full hover:bg-orange-100 hidden md:inline-flex"
    >
      <i class="pi pi-chevron-left text-xl text-orange-500"></i>
    </button>
    <button
      @click="scrollRight"
      class="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-2 rounded-full hover:bg-orange-100 hidden md:inline-flex"
    >
      <i class="pi pi-chevron-right text-xl text-orange-500"></i>
    </button>

    <!-- Title -->
    <div class="px-4 max-w-screen-xl mx-auto pt-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ title }}</h2>
    </div>

    <!-- Mobile Grid -->
    <div class="md:hidden grid grid-cols-2 gap-4 px-4 max-w-screen-xl mx-auto pb-6">
      <RouterLink
        v-for="(product, index) in products"
        :key="index"
        :to="{ name: 'productDetail', params: { id: product.id } }"
        class="block"
      >
        <ProductCard :product="product" />
      </RouterLink>
    </div>

    <!-- Desktop Horizontal Scroll -->
    <div
      ref="scrollRef"
      class="hidden md:flex gap-4 scroll-smooth overflow-x-auto px-4 max-w-screen-xl mx-auto pb-6 touch-pan-x hide-scrollbar"
    >
      <RouterLink
        v-for="(product, index) in products"
        :key="index"
        :to="{ name: 'productDetail', params: { id: product.id } }"
        class="block flex-shrink-0 w-[210px]"
      >
        <ProductCard :product="product" />
      </RouterLink>
    </div>
  </div>
</template>