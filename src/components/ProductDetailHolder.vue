<template>
  <div class="max-w-screen-xl mx-auto px-4 py-8">
    <div class="flex flex-col lg:flex-row gap-10">
      <!-- Image -->
      <div class="flex-1">
        <img :src="product.image" :alt="product.name" loading="lazy" class="rounded-xl w-full max-h-[500px] object-contain shadow" />
      </div>

      <!-- Details -->
      <div class="flex-1 space-y-4">
        <h1 class="text-3xl font-bold text-gray-800">{{ product.name }}</h1>
        <p class="text-gray-600">{{ product.description }}</p>

        <!-- ✅ Show price & discount -->
        <div class="text-2xl font-bold mt-2">
          <span v-if="product.discount_price">
            <span class="text-gray-400 line-through mr-2">{{ product.price }} DA</span>
            <span class="text-orange-500">{{ product.discount_price }} DA</span>
          </span>
          <span v-else class="text-orange-500">{{ product.price }} DA</span>
        </div>

        <!-- Stock info -->
        <p class="text-sm text-gray-500">In Stock: {{ product.stock }}</p>

        <!-- Variants -->
        <div class="space-y-3">
          <!-- Color -->
          <div v-if="product.colors?.length">
            <h3 class="font-medium text-gray-700">Color:</h3>
            <div class="flex gap-2">
              <button
                v-for="color in product.colors"
                :key="color"
                @click="selectedColor = color"
                :class="[
                  'w-8 h-8 rounded-full border-2',
                  color,
                  selectedColor === color ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-300'
                ]"
              ></button>
            </div>
          </div>

          <!-- Size -->
          <div v-if="product.sizes?.length">
            <h3 class="font-medium text-gray-700">Size:</h3>
            <div class="flex gap-2">
              <button
                v-for="size in product.sizes"
                :key="size"
                @click="selectedSize = size"
                :class="[
                  'px-4 py-2 border rounded-md text-sm font-medium',
                  selectedSize === size ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 text-gray-700 hover:bg-orange-50'
                ]"
              >
                {{ size }}
              </button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="pt-4 flex items-center gap-4 flex-wrap">
          <div class="flex items-center gap-2">
            <label for="quantity" class="text-gray-700 font-medium">Quantity:</label>
            <input
              id="quantity"
              v-model.number="quantity"
              type="number"
              min="1"
              class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none"
            />
          </div>

          <button
            class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full text-lg font-medium transition"
            @click="addToCart"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const selectedColor = ref(props.product.colors?.[0] || '')
const selectedSize = ref(props.product.sizes?.[0] || '')
const quantity = ref(1)

const cartStore = useCartStore()
const router = useRouter()
const addToCart = () => {
  if (quantity.value < 1) {
    toast.warning('Quantity must be at least 1')
    return
  }

  const existing = cartStore.items.find(i => i.productId === props.product.id)
  const currentQty = existing?.quantity || 0
  const newTotalQty = currentQty + quantity.value

  if (newTotalQty > props.product.stock) {
    toast.error(`You already have ${currentQty} in cart. Only ${props.product.stock} in stock.`)
    return
  }

  const item = {
    productId: props.product.id,
    stock : props.product.stock,
    name: props.product.name,
    price: props.product.discount_price || props.product.price,
    image: props.product.image,
    color: selectedColor.value,
    size: selectedSize.value,
    quantity: quantity.value,
  }

  cartStore.addItem(item)
  toast.success(`${props.product.name} x${quantity.value} added to cart`)
  router.push({ name: 'products' })
}
</script>
