<template>
  <section class="max-w-screen-xl mx-auto px-4 py-6">
    <h2 v-if="title" class="text-xl font-bold text-gray-800 mb-4">{{ title }}</h2>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <component
        v-for="product in products"
        :key="product.id"
        :is="product.stock > 0 ? RouterLink : 'div'"
        :to="product.stock > 0 ? { name: 'productDetail', params: { id: product.id } } : undefined"
        class="block"
      >
        <ProductCard :product="product" />
      </component>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import ProductCard from './ProductCard.vue'

const props = defineProps({
  title: String,
  products: {
    type: Array,
    default: () => [],
  },
})
</script>
