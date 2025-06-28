<template>
  <div class="max-w-screen-xl mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <!-- Product Image -->
      <div class="flex justify-center items-center">
        <Card class="w-full">
          <template #content>
            <img
              :src="getOptimizedImage(product.image)"
              :alt="product.name"
              loading="lazy"
              width="600"
              height="500"
              class="rounded-xl w-full max-h-[500px] object-contain shadow"
            />
          </template>
        </Card>
      </div>

      <!-- Product Details -->
      <div>
        <Card class="w-full">
          <template #content>
            <div class="space-y-6">
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800">{{ product.name }}</h1>
              <p class="text-gray-600 text-sm md:text-base">{{ product.description }}</p>

              <Divider />

              <!-- Price & Promo -->
              <div class="flex items-center gap-3 flex-wrap">
                <span v-if="product.discount_price" class="text-gray-400 line-through text-xl">
                  {{ product.price }} DA
                </span>
                <span class="text-2xl font-bold text-orange-500">
                  {{ product.discount_price || product.price }} DA
                </span>
                <Tag v-if="product.discount_price" severity="warn" value="Promo" />
              </div>

              <Divider />

              <!-- Size -->
              <div class="flex flew-row gap-4">

                <div v-if="product.size" class="flex items-center gap-2 flex-wrap">
                  <i class="pi pi-tag text-orange-500"></i>
                  <span class="font-medium text-gray-700">Size:</span>
                  <Tag :value="product.size" class="bg-orange-100 text-orange-600 border-none" />
                </div>

                <!-- Stock -->
                <div class="flex items-center gap-2 flex-wrap">
                  <i class="pi pi-box text-gray-500"></i>
                  <span class="font-medium text-gray-700">In Stock:</span>
                  <Tag
                    :value="product.stock"
                    :severity="product.stock === 0 ? 'danger' : 'info'"
                    class="font-semibold"
                  />
                </div>
              </div>
              <!-- Color Options -->
              <div v-if="product.colors?.length">
                <span class="font-medium text-gray-700">Color:</span>
                <div class="flex gap-2 mt-2 flex-wrap">
                  <Button
                    v-for="color in product.colors"
                    :key="color"
                    @click="selectedColor = color"
                    :style="{
                      background: color,
                      borderColor: selectedColor === color ? '#fb923c' : '#d1d5db',
                    }"
                    class="w-8 h-8 p-0 border-2 rounded-full shadow-none"
                    :outlined="selectedColor !== color"
                  />
                </div>
              </div>

              <Divider />

              <!-- Quantity and Add to Cart -->
              <div class="flex flex-col gap-4 pt-4">
                <div class="flex items-center gap-2 max-w-36">
                  <label for="quantity" class="text-gray-700 font-medium">Quantity:</label>
                  <InputNumber
                    id="quantity"
                    v-model="quantity"
                    :min="1"
                    :max="product.stock"
                    showButtons
                    buttonLayout="horizontal"
                    decrementButtonClass="p-button-text"
                    incrementButtonClass="p-button-text"
                    :disabled="product.stock === 0"
                    class="w-full sm:w-32"
                    :inputStyle="{ width: '60px' }"
                  />
                </div>
                <Button
                  :label="product.stock === 0 ? 'Out of Stock' : 'Add to Cart'"
                  :disabled="product.stock === 0"
                  class="w-full sm:w-auto px-6 py-3 rounded-full text-lg font-medium"
                  :class="product.stock === 0 ? 'p-button-secondary' : 'p-button-warning'"
                  @click="addToCart"
                />
              </div>
            </div>
          </template>
        </Card>
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

// PrimeVue components
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const selectedColor = ref(props.product.colors?.[0] || '')
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
    stock: props.product.stock,
    name: props.product.name,
    price: props.product.discount_price || props.product.price,
    image: props.product.image,
    color: selectedColor.value,
    size: props.product.size,
    quantity: quantity.value,
  }

  cartStore.addItem(item)
  toast.success(`${props.product.name} x${quantity.value} added to cart`)
  router.push({ name: 'products' })
}

function getOptimizedImage(url) {
  if (!url.includes('res.cloudinary.com')) return url

  const parts = url.split('/upload/')
  return `${parts[0]}/upload/f_auto,q_auto,w_600,h_500,c_pad,b_white/${parts[1]}`
}


</script>

<style scoped>
/* Optional: Add custom styles for further beauty */
</style>
