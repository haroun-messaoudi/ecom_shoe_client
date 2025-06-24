<template>
  <section class="relative">
    <!-- Blocking full-page loading screen -->
    <div
      v-if="submitting"
      class="fixed inset-0 bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center space-y-4"
    >
      <svg class="animate-spin h-10 w-10 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
      <p class="text-lg text-gray-700">Submitting your order…</p>
    </div>

    <section class="max-w-screen-lg mx-auto px-4 sm:px-6 py-8 space-y-10">
      <ConfirmDialog />

      <!-- Cart List -->
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-800">Your Cart</h2>

        <div
          v-if="cartStore.items.length > 0"
          v-for="item in cartStore.items"
          :key="item.productId"
          class="flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-4"
        >
          <img :src="item.image" :alt="item.name" class="w-24 h-24 rounded-xl object-cover" />
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center justify-between">
              {{ item.name }}
              <button
                @click="confirmRemove(item.productId)"
                class="text-red-500 hover:text-red-700 ml-4"
                title="Remove"
              >
                ✕
              </button>
            </h3>
            <div class="flex items-center gap-2 mt-1">
              <label class="text-gray-700 font-medium">Qty:</label>
              <input
                type="number"
                :value="item.quantity"
                disabled
                class="w-16 px-2 py-1 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>
            <p class="text-orange-500 font-medium mt-1">{{ item.price }} DA each</p>
            <p class="text-gray-700 mt-1">
              Subtotal: <span class="font-semibold">{{ item.price * item.quantity }} DA</span>
            </p>
          </div>
        </div>

        <!-- Empty Cart Message + Button -->
        <div v-if="cartStore.items.length === 0" class="text-center py-12 space-y-4">
          <p class="text-lg text-gray-700">Your cart is empty.</p>
          <RouterLink
            to="/"
            class="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition"
          >
            Add Products
          </RouterLink>
        </div>

        <!-- Total -->
        <div v-if="cartStore.items.length > 0" class="flex justify-end">
          <div class="text-xl font-bold text-gray-700">
            Total: <span class="text-orange-500">{{ totalPrice }} DA</span>
          </div>
        </div>
      </div>

      <!-- Delivery Form -->
      <div v-if="cartStore.items.length > 0" class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-800">Delivery Information</h2>

        <div>
          <label for="name" class="block text-gray-700 font-medium mb-1">Full Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Your full name"
            class="w-full sm:w-96 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        <div class="mb-4">
          <label for="phone" class="block text-gray-700 font-medium mb-1">Phone Number</label>
          <input
            id="phone"
            v-model="phone"
            type="tel"
            placeholder="06XXXXXXXX"
            class="w-full sm:w-96 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        <div class="flex flex-row gap-4 pt-4 pb-4">
          <div class="flex items-center gap-2">
            <RadioButton inputId="home" name="delivery" value="home" v-model="deliveryType" class="!text-orange-500" />
            <label for="home" class="text-gray-700">Home</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioButton inputId="bureau" name="delivery" value="bureau" v-model="deliveryType" class="!text-orange-500" />
            <label for="bureau" class="text-gray-700">Bureau</label>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <Dropdown
            v-model="selectedState"
            :options="states"
            optionLabel="name"
            placeholder="Select Wilaya"
            class="w-full sm:w-64 mt-4 mb-2"
            filter
          />
          <Dropdown
            v-model="selectedCommune"
            :options="communes[selectedState?.code] || []"
            optionLabel="name"
            placeholder="Select Commune"
            class="w-full sm:w-64 mt-4 mb-2"
            :disabled="!selectedState || deliveryType !== 'home'"
            filter
          />
        </div>

        <div class="pt-4">
          <button
            class="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition"
            @click="confirmOrder"
          >
            Submit Order
          </button>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import Dropdown from 'primevue/dropdown'
import RadioButton from 'primevue/radiobutton'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { RouterLink } from 'vue-router'
import axios from 'axios'

// ✅ Toastify
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const cartStore = useCartStore()
const confirm = useConfirm()

const name = ref('')
const phone = ref('')
const deliveryType = ref('home')
const selectedState = ref(null)
const selectedCommune = ref(null)
const submitting = ref(false)

const states = [
  { name: 'Algiers', code: 'ALG', id: 1 },
  { name: 'Oran', code: 'ORN', id: 2 },
  { name: 'Constantine', code: 'CON', id: 3 }
]

const communes = {
  ALG: [ { name: 'Bab El Oued', id: 101 }, { name: 'Hydra', id: 102 }, { name: 'El Harrach', id: 103 } ],
  ORN: [ { name: 'Bir El Djir', id: 201 }, { name: 'Es Senia', id: 202 } ],
  CON: [ { name: 'El Khroub', id: 301 }, { name: 'Ali Mendjeli', id: 302 } ]
}

const totalPrice = computed(() => cartStore.totalPrice)

function confirmRemove(productId) {
  confirm.require({
    message: 'Remove this item from your cart?',
    header: 'Please Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      cartStore.removeItem(productId)
      toast.info('Item removed from cart')
    }
  })
}

function confirmOrder() {
  confirm.require({
    message: 'Are you sure you want to submit your order?',
    header: 'Confirm Order',
    icon: 'pi pi-check',
    accept: submitOrder
  })
}

async function submitOrder() {
  submitting.value = true
  try {
    const payload = {
      costumer_name: name.value,
      costumer_phone: phone.value,
      delivery_type: deliveryType.value === 'home' ? 'A Domicile' : 'Bureau',
      delivery_fees: deliveryType.value === 'home' ? 500 : 0,
      wilaya: selectedState.value?.id,
      commune: deliveryType.value === 'home' ? selectedCommune.value?.id : null,
      items: cartStore.items.map(i => ({
        product: i.productId,
        quantity: i.quantity
      }))
    }

    await axios.post('https://ecom-1qve.onrender.com/api/orders/create', payload)
    toast.success('Your order was placed successfully!')
    cartStore.clearCart()
  } catch (err) {
    console.error(err)

    if (err.response?.status === 400 && err.response.data) {
      const errors = err.response.data
      for (const key in errors) {
        const messages = errors[key]
        if (Array.isArray(messages)) {
          messages.forEach(msg => toast.error(`${key.replace(/_/g, ' ')}: ${msg}`))
        } else {
          toast.error(`${key}: ${messages}`)
        }
      }
    } else {
      toast.error('Something went wrong while submitting your order.')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
:deep(.p-focus) {
  border-color: #f97316 !important;
  box-shadow: 0 0 0 0.2rem rgba(251, 146, 60, 0.3) !important;
}
:deep(.p-radiobutton-box.p-highlight) {
  border-color: #f97316 !important;
  background-color: #f97316 !important;
}
:deep(.p-radiobutton-icon) {
  background-color: white !important;
}
</style>
