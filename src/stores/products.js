// src/stores/products.js
import { defineStore } from 'pinia'
import axios from 'axios'

const BASE_URL = 'https://ecom-1qve.onrender.com/api/products'

export const useProductStore = defineStore('product', {
  state: () => ({
    discounted: [],
    discountedCount: 0,

    newProducts: [],
    newCount: 0,

    topOrdered: [],

    loading: false,
    error: null,
  }),

  actions: {
    async fetchDiscounted(params = {}) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/discounted/`, { params })
        this.discounted = res.data
        this.discountedCount = res.data.count
      } catch (err) {
        this.error = 'Failed to load discounted products.'
      } finally {
        this.loading = false
      }
    },

    async fetchNewProducts(params = {}) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/new-products/`, { params })
        this.newProducts = res.data
        this.newCount = res.data.count
      } catch (err) {
        this.error = 'Failed to load new products.'
      } finally {
        this.loading = false
      }
    },

    async fetchTopOrdered() {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/top-ordered/`)
        this.topOrdered = res.data
      } catch (err) {
        this.error = 'Failed to load top ordered products.'
      } finally {
        this.loading = false
      }
    },
  },
})
