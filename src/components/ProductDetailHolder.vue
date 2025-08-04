<template>
  <div class="max-w-screen-xl mx-auto px-4 py-8">
    <!-- Dynamic Breadcrumb: top left, above product -->
    <nav class="mb-6 w-full overflow-x-auto" aria-label="Breadcrumb">
      <ol class="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-500 font-normal whitespace-nowrap">
        <template v-for="(crumb, index) in breadcrumb" :key="index">
          <li class="flex items-center">
          <router-link
            v-if="crumb.to"
            :to="crumb.to"
            class="hover:text-black transition-colors text-lg text-gray-500"
          >
            {{ crumb.name }}
          </router-link>
          <span v-else class="text-slate-800 font-semibold text-base">
            {{ crumb.name }}
          </span>
          <span v-if="index < breadcrumb.length - 1" class="mx-1 text-gray-400">
            &gt;
          </span>
        </li>

        </template>
      </ol>
    </nav>


    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <!-- Product Images Gallery -->
      <div>
        <Card class="w-full">
          <template #content>
            <Transition name="fade-slide" appear>
              <div v-if="mainImage" class="flex flex-col">
                <!-- Product Name: top left, big and clear (mobile only, OUTSIDE image holder) -->
                <h1 class="text-3xl font-extrabold text-slate-800 mb-4 text-left sm:hidden">
                  {{ product.name }}
                </h1>
                <!-- Main Image Holder (desktop/tablet) -->
                <div
                  class="bg-white shadow mb-6 flex items-center justify-center min-h-[500px] relative hidden sm:flex"
                  @touchstart="handleTouchStart"
                  @touchend="handleTouchEnd"
                >
                  <img
                    :src="mainImage.image"
                    :alt="product.name"
                    loading="eager"
                    class="rounded-xl max-h-[600px] object-contain transition-all duration-300"
                    style="max-width: 100%;"
                  />
                  <!-- Left/Right arrows: show only on desktop/tablet (sm and above) -->
                  <button
                    v-if="galleryImages.length > 1"
                    class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-orange-100 hidden sm:block"
                    @click="prevImage"
                    aria-label="Previous image"
                  >
                    <svg width="24" height="24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#FF6F00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <button
                    v-if="galleryImages.length > 1"
                    class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-orange-100 hidden sm:block"
                    @click="nextImage"
                    aria-label="Next image"
                  >
                    <svg width="24" height="24" fill="none"><path d="M9 6l6 6-6 6" stroke="#FF6F00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </div>
                <!-- Only one holder for mobile: image + dots -->
                <div class="relative min-h-[400px] flex items-center justify-center sm:hidden">
                  <Transition :name="transitionDirection === 'left' ? 'slide-left' : 'slide-right'" mode="out-in">
                    <img
                      :src="mainImage.image"
                      :alt="product.name"
                      loading="eager"
                      class="max-h-[350px] object-contain transition-all duration-300"
                      style="max-width: 100%;"
                      @touchstart="handleTouchStart"
                      @touchend="handleTouchEnd"
                      :key="mainImage?.image"
                    />
                  </Transition>

                  <!-- Dots Indicator: absolutely positioned at the bottom center -->
                  <div
                    v-if="galleryImages.length > 1"
                    class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-3"
                  >
                    <span
                      v-for="(img, idx) in galleryImages"
                      :key="img.id || idx"
                      class="w-3.5 h-3.5 rounded-full transition-all duration-200"
                      :style="{
                        background: idx === currentImageIndex ? '#FF6F00' : '#e5e7eb',
                        border: idx === currentImageIndex ? '2px solid #FF6F00' : '2px solid #e5e7eb'
                      }"
                    ></span>
                  </div>
                </div>
                <!-- Thumbnails: show only on desktop (sm and above) -->
                <div
                  v-if="!loadingExtras && product.images && product.images.length > 1"
                  class="flex gap-3 overflow-x-auto pb-2 bg-gray-50 rounded-lg px-3 py-2 shadow-inner hidden sm:flex"
                >
                  <img
                    v-for="img in product.images"
                    loading="eager"
                    :key="img.id"
                    :src="getOptimizedImage(img.image)"
                    :alt="product.name"
                    class="w-20 h-20 object-contain rounded-lg border cursor-pointer shrink-0 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    :class="{
                      'ring-2 ring-orange-500 border-orange-300': img.id === mainImage?.id,
                      'border-gray-200': img.id !== mainImage?.id
                    }"
                    @click="selectMainImage(img)"
                  />
                </div>
                <!-- Price: below image section, big and highlighted (mobile only) -->
                <div class="mt-6 flex items-center justify-center gap-2 flex-nowrap sm:hidden whitespace-nowrap overflow-hidden">
                  <span v-if="product.discount_price" class="text-gray-400 line-through text-base sm:text-lg whitespace-nowrap">
                    {{ Math.floor(product.price) }}&nbsp;DA
                  </span>
                  <span class="text-2xl sm:text-3xl font-extrabold text-orange-600 drop-shadow whitespace-nowrap">
                    {{ Math.floor(product.discount_price || product.price) }}&nbsp;DA
                  </span>
                  <span
                    v-if="product.discount_price"
                    class="ml-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-bold text-base"
                  >
                    -{{ Math.round(100 - (product.discount_price / product.price) * 100) }}%
                  </span>
                </div>
              </div>
            </Transition>
          </template>
        </Card>
      </div>

      <!-- Product Details -->
      <div>
        <Card class="w-full">
          <template #content>
            <Transition name="fade-slide" appear>
              <div class="space-y-6">
                <!-- Product Name: desktop/tablet only -->
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800 hidden sm:block">
                  {{ product.name }}
                </h1>
                <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                  {{ product.description }}
                </p>
                <Divider />
                <!-- Price: desktop/tablet only -->
                <div class="flex items-center gap-3 flex-wrap hidden sm:flex">
                  <span v-if="product.discount_price" class="text-gray-400 line-through text-xl">
                    {{ Number(product.price).toFixed(0) }} DA
                  </span>
                  <span class="text-2xl font-bold text-orange-500">
                    {{ Number(product.discount_price || product.price).toFixed(0) }} DA
                  </span>
                  <span
                    v-if="product.discount_price"
                    class="ml-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-bold text-base"
                  >
                    -{{ Math.round(100 - (product.discount_price / product.price) * 100) }}%
                  </span>
                </div>
                <Divider />
                <div class="space-y-2">
                  <div v-if="!loadingExtras && product.variants && product.variants.length" class="flex flex-col gap-2">
                    <span class="text-gray-700 font-medium">Choose Size:</span>
                    <div class="flex gap-2 flex-wrap">
                      <Button
                        v-for="variant in product.variants"
                        :key="variant.id"
                        :label="variant.size"
                        :disabled="variant.stock === 0"
                        @click="selectVariant(variant)"
                        :class="selectedVariant?.id === variant.id ? 'p-button-warning' : 'p-button-outlined'"
                      />
                    </div>
                  </div>
                  <div v-else-if="loadingExtras" class="flex gap-2">
                    <div v-for="n in 3" :key="n" class="w-16 h-10 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
                <Divider />
                <div class="flex flex-col sm:flex-row sm:gap-12 sm:items-center gap-4 pt-4">
                  <div class="flex items-center gap-2">
                    <label for="quantity" class="text-gray-700 font-medium">Quantity:</label>
                    <InputNumber
                      id="quantity"
                      v-model.number="rawQuantity"
                      :min="1"
                      showButtons
                      buttonLayout="horizontal"
                      decrementButtonClass="p-button-text"
                      incrementButtonClass="p-button-text"
                      :disabled="!selectedVariant || maxAddable <= 0"
                      class="w-28"
                      :inputStyle="{ width: '60px' }"
                    />
                  </div>
                  <Button
                    label="Add to Cart"
                    :disabled="!selectedVariant || selectedVariant.stock === 0 || maxAddable <= 0"
                    class="w-full sm:w-auto px-6 py-3 rounded-full text-lg font-medium p-button-warning"
                    @click="addToCart"
                  />
                  <Button
                    label="Buy Now"
                    v-if="selectedVariant && selectedVariant.stock > 0"
                    :disabled="!selectedVariant || maxAddable <= 0"
                    class="w-full sm:w-auto px-6 py-3 rounded-full text-lg font-medium p-button-success"
                    @click="buyNow"
                  />
                </div>
              </div>
            </Transition>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
const transitionDirection = ref('') // 'left' or 'right'

const props = defineProps({
  product: { type: Object, required: true },
  loadingExtras: { type: Boolean, default: false }
})

const breadcrumb = computed(() => {
  const crumbs = [{ name: 'Home', to: '/' }]

  if (props.product?.category?.name && props.product?.category?.slug) {
    // If category exists, link to the category
    crumbs.push({
      name: props.product.category.name,
      to: `/products?category=${props.product.category.slug}`
    })
  } else {
    // Fallback to generic products page
    crumbs.push({ name: 'Products', to: '/products' })
  }

  // Final breadcrumb: product name (not a link)
  crumbs.push({ name: props.product.name })

  return crumbs
})

const selectedVariant = ref(null)
const mainImage = ref(null)
const rawQuantity = ref(1)

const cartStore = useCartStore()
const router = useRouter()

function getOptimizedImage(url) {
  if (!url) return ''
  // Only optimize if it's a Cloudinary image
  if (url.includes('res.cloudinary.com')) {
    const parts = url.split('/upload/')
    if (parts.length === 2) {
      // Add Cloudinary transformation for optimization
      return `${parts[0]}/upload/f_auto,q_auto,w_800,h_600,c_fit/${parts[1]}`
    }
  }
  // Return original for non-Cloudinary images
  return url
}

const galleryImages = computed(() =>
  props.product.images && props.product.images.length > 0
    ? props.product.images.map(img => ({
        ...img,
        image: getOptimizedImage(img.image)
      }))
    : props.product.main_image
      ? [{ image: getOptimizedImage(props.product.main_image) }]
      : []
)

const currentImageIndex = ref(0)

watch(galleryImages, (imgs) => {
  if (imgs.length > 0) {
    currentImageIndex.value = 0
    mainImage.value = imgs[0]
  }
}, { immediate: true })

function nextImage() {
  if (galleryImages.value.length > 1) {
    transitionDirection.value = 'left'
    currentImageIndex.value = (currentImageIndex.value + 1) % galleryImages.value.length
    mainImage.value = galleryImages.value[currentImageIndex.value]
  }
}

function prevImage() {
  if (galleryImages.value.length > 1) {
    transitionDirection.value = 'right'
    currentImageIndex.value =
      (currentImageIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
    mainImage.value = galleryImages.value[currentImageIndex.value]
  }
}

// Always set mainImage from main_image immediately, then update if images arrive
watch(
  [() => props.product.main_image, () => props.product.images],
  ([mainImg, images]) => {
    if (images && images.length > 0) {
      const main = images.find(img => img.is_main) || images[0]
      const optimizedMain = { ...main, image: getOptimizedImage(main.image) }
      mainImage.value = optimizedMain

      const index = galleryImages.value.findIndex(i => i.id === main.id)
      if (index !== -1) {
        currentImageIndex.value = index
      }
    } else if (mainImg) {
      mainImage.value = { image: getOptimizedImage(mainImg) }
    } else {
      mainImage.value = null
    }
    selectedVariant.value = null
    rawQuantity.value = 1
  },
  { immediate: true }
)

function selectMainImage(img) {
  const index = galleryImages.value.findIndex(i => i.id === img.id)
  if (index !== -1) {
    currentImageIndex.value = index
  }
  mainImage.value = { ...img, image: getOptimizedImage(img.image) }
}

function selectVariant(variant) {
  selectedVariant.value = variant
  rawQuantity.value = 1
}

const maxAddable = computed(() =>
  selectedVariant.value
    ? selectedVariant.value.stock - (cartStore.items.find(i => i.variantId === selectedVariant.value.id)?.quantity || 0)
    : 0
)

function addToCart() {
  if (!selectedVariant.value) {
    toast.warning('Please select a size.')
    return
  }

  const qty = rawQuantity.value
  if (qty < 1 || qty > selectedVariant.value.stock || qty > maxAddable.value) {
    toast.error(`Invalid quantity.`)
    return
  }

  const item = {
    productId: props.product.id,
    variantId: selectedVariant.value.id,
    size: selectedVariant.value.size,
    stock: selectedVariant.value.stock,
    name: props.product.name,
    price: props.product.discount_price || props.product.price,
    image: mainImage.value?.image || '',
    quantity: qty,
  }

  cartStore.addItem(item)
  toast.success(`${props.product.name} (Size: ${item.size}) x${qty} added to cart`)
  router.push({ name: 'products' })
}

function buyNow() {
  if (!selectedVariant.value || rawQuantity.value > maxAddable.value) {
    toast.warning('Invalid quantity or size.')
    return
  }

  const item = {
    productId: props.product.id,
    variantId: selectedVariant.value.id,
    size: selectedVariant.value.size,
    stock: selectedVariant.value.stock,
    name: props.product.name,
    price: props.product.discount_price || props.product.price,
    image: mainImage.value?.image || '',
    quantity: rawQuantity.value,
  }

  cartStore.addItem(item)
  toast.success(`${props.product.name} (Size: ${item.size}) x${rawQuantity.value} added to cart`)
  router.push({ name: 'cart' })
}

let startX = null

function handleTouchStart(e) {
  startX = e.touches[0].clientX
}
function handleTouchEnd(e) {
  if (startX === null) return
  const endX = e.changedTouches[0].clientX
  const diff = endX - startX
  if (Math.abs(diff) > 40) {
    if (diff > 0) prevImage()
    else nextImage()
  }
  startX = null
}
</script>

<style scoped>
.bg-gray-50 {
  background-color: #f9fafb;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-left-enter-active,
.slide-right-enter-active,
.slide-left-leave-active,
.slide-right-leave-active {
  transition: all 0.4s ease;
  position: absolute;
  width: 100%;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-enter-to {
  transform: translateX(0%);
  opacity: 1;
}
.slide-left-leave-from {
  transform: translateX(0%);
  opacity: 1;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-enter-to {
  transform: translateX(0%);
  opacity: 1;
}
.slide-right-leave-from {
  transform: translateX(0%);
  opacity: 1;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
