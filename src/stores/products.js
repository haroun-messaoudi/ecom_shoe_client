// src/stores/products.js
import { defineStore } from 'pinia'
import axios from 'axios'

const BASE_URL = 'https://ecom-shoe-b2nx.onrender.com/api/products'

export const useProductStore = defineStore('product', {
  state: () => ({
    // Discounted Products
    discounted: [],
    discountedCount: 0,
    discountedNext: null,
    discountedPrevious: null,

    // New Products
    newProducts: [],
    newCount: 0,
    newNext: null,
    newPrevious: null,

    // Top Ordered
    topOrdered: [],
    topOrderedCount: 0,
    topOrderedNext: null,
    topOrderedPrevious: null,

    // Loading and error
    loading: false,
    error: null,
  }),

  actions: {
    async fetchDiscounted(params = { page: 1, page_size: 8 }) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/discounted/`, { params })
        const data = res.data
        // Only main image for listings
        this.discounted = (data.results || data).map(product => ({
          ...product,
          image: product.main_image_url // use only main image
        }))
        this.discountedCount = data.count ?? this.discounted.length
        this.discountedNext = data.next ?? null
        this.discountedPrevious = data.previous ?? null
      } catch {
        this.error = 'Failed to load discounted products.'
      } finally {
        this.loading = false
      }
    },

    async fetchNewProducts(params = { page: 1, page_size: 8 }) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/new-products/`, { params })
        const data = res.data
        this.newProducts = (data.results || data).map(product => ({
          ...product,
          image: product.main_image_url, // use only main image
          isNew: true,
        }))
        this.newCount = data.count ?? this.newProducts.length
        this.newNext = data.next ?? null
        this.newPrevious = data.previous ?? null
      } catch {
        this.error = 'Failed to load new products.'
      } finally {
        this.loading = false
      }
    },

    async fetchTopOrdered(params = { page: 1, page_size: 8 }) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/top-ordered/`, { params })
        const data = res.data
        this.topOrdered = (data.results || data).map(product => ({
          ...product,
          image: product.main_image_url // use only main image
        }))
        this.topOrderedCount = data.count ?? this.topOrdered.length
        this.topOrderedNext = data.next ?? null
        this.topOrderedPrevious = data.previous ?? null
      } catch {
        this.error = 'Failed to load top ordered products.'
      } finally {
        this.loading = false
      }
    },
  },
})
