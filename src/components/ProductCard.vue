<template>
  <div
    class="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden w-full max-w-xs border border-gray-100 hover:border-orange-400 flex flex-col h-60"
  >
    <!-- Product Image -->
    <div class="relative w-full h-36 overflow-hidden group">
      <img
        :src="product.image"
        :alt="product.name"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <span
        v-if="product.isNew"
        class="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm"
      >
        New
      </span>
    </div>

    <!-- Product Details -->
    <div class="p-4 flex-1 flex flex-col">
      <!-- Title -->
      <h3 class="text-sm font-semibold text-gray-800 line-clamp-2">
        {{ product.name }}
      </h3>

      <!-- Price -->
      <div class="mt-auto pt-2 space-x-2">
        <span class="text-base font-bold text-orange-500">
          {{ displayPrice(product).toLocaleString() }} DA
        </span>
        <span
          v-if="product.discount_price"
          class="text-sm text-gray-400 line-through"
        >
          {{ product.price.toLocaleString() }} DA
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      image: 'https://via.placeholder.com/300x300',
      name: 'Product Name',
      description: 'Short description here.',
      price: 999,
      discount_price: null,
      isNew: false,
    }),
  },
})

function displayPrice(product) {
  return product.discount_price ?? product.price
}
</script>

<style scoped>
/* Add more scoped styling if needed */
</style>
