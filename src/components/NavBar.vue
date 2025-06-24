<!-- src/components/Navbar.vue -->
<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSearchStore } from '@/stores/search'

const router      = useRouter()
const route       = useRoute()
const searchStore = useSearchStore()

// Local v-model for the input, initialized from URL
const searchQuery = ref(route.query.search || '')
const mobileOpen  = ref(false)

// Keep the store up to date as the user types
watch(searchQuery, q => {
  searchStore.setSearchTerm(q.trim())
})

// Submit handler: push both search + any existing category
const onSearch = () => {
  const q = searchQuery.value.trim()
  router.push({
    path: '/products',
    query: {
      search:   q || undefined,
      category: route.query.category || undefined
    }
  })
}

const navLinks = [
  { label: 'On Sale',      path: '/OnSales', query: { sale: true } },
  { label: 'New Arrivals', path: '/NewArrivals', query: { new: true } },
]
</script>

<template>
  <header class="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
    <div class="flex items-center justify-between px-4 py-2 md:px-8">
      <div class="flex items-center gap-2">
        <button class="md:hidden p-2 rounded hover:bg-gray-100"
                @click="mobileOpen = !mobileOpen">
          <i class="pi pi-bars text-2xl"></i>
        </button>
        <RouterLink to="/" class="hidden md:inline p-2 rounded hover:bg-orange-100">
          <i class="pi pi-home text-orange-500 text-3xl"></i>
        </RouterLink>
      </div>

      <form @submit.prevent="onSearch" class="flex flex-1 mx-4 relative">
        <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="w-full pl-12 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-lg"
        />
      </form>

      <div class="flex items-center gap-4">
        <nav class="hidden md:flex items-center gap-4">
          <RouterLink
            v-for="link in navLinks"
            :key="link.label"
            :to="{ path: link.path, query: link.query }"
            class="px-3 py-2 rounded hover:bg-orange-50 text-gray-700 font-medium"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
        <RouterLink to="/cart" class="p-2 rounded hover:bg-orange-100 transition">
          <i class="pi pi-shopping-cart text-orange-500 text-3xl"></i>
        </RouterLink>
      </div>
    </div>

    <transition name="slide">
      <div v-if="mobileOpen" class="md:hidden bg-white border-t border-gray-200">
        <nav class="flex flex-col px-4 py-2 space-y-2">
          <RouterLink to="/" @click="mobileOpen = false" class="flex items-center px-3 py-2 rounded hover:bg-orange-50">
            Home
          </RouterLink>
          <RouterLink
            v-for="link in navLinks"
            :key="link.label"
            @click="mobileOpen = false"
            :to="{ path: link.path, query: link.query }"
            class="px-3 py-2 rounded hover:bg-orange-50 text-gray-700 font-medium"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
      </div>
    </transition>
  </header>
  <div class="h-20"></div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease-out;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  overflow: hidden;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 200px;
}
</style>
