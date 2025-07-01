import { defineStore } from 'pinia'
import axios from 'axios'
const BASE_URL = 'http://127.0.0.1:8000/api/products'

export const useProductStore = defineStore('product', {
  state: () => ({
    discounted: [],
    newProducts: [],
    topOrdered: [],
    discountedCount: 0,
    newCount: 0,
    topOrderedCount: 0,
    discountedNext: null,
    newNext: null,
    topOrderedNext: null,
    discountedPrevious: null,
    newPrevious: null,
    topOrderedPrevious: null,
    loadingTopOrdered: false,
    loadingDiscounted: false,
    loadingNewProducts: false,
    error: null,
  }),

  actions: {
    async fetchDiscounted(params = { page: 1, page_size: 8 }) {
      this.loadingDiscounted = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/discounted/`, { params })
        const data = res.data
        this.discounted = (data.results || data).map(p => ({
          ...p,
          image: p.main_image_url
        }))
        this.discountedCount = data.count ?? this.discounted.length
        this.discountedNext = data.next ?? null
        this.discountedPrevious = data.previous ?? null
      } catch {
        this.error = 'Failed to load discounted products.'
      } finally {
        this.loadingDiscounted = false
      }
    },

    async fetchNewProducts(params = { page: 1, page_size: 8 }) {
      this.loadingNewProducts = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/new-products/`, { params })
        const data = res.data
        this.newProducts = (data.results || data).map(p => ({
          ...p,
          image: p.main_image_url,
          isNew: true
        }))
        this.newCount = data.count ?? this.newProducts.length
        this.newNext = data.next ?? null
        this.newPrevious = data.previous ?? null
      } catch {
        this.error = 'Failed to load new products.'
      } finally {
        this.loadingNewProducts = false
      }
    },

    async fetchTopOrdered(params = { page: 1, page_size: 8 }) {
      this.loadingTopOrdered = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/top-ordered/`, { params })
        const data = res.data
        this.topOrdered = (data.results || data).map(p => ({
          ...p,
          image: p.main_image_url
        }))
        this.topOrderedCount = data.count ?? this.topOrdered.length
        this.topOrderedNext = data.next ?? null
        this.topOrderedPrevious = data.previous ?? null
      } catch {
        this.error = 'Failed to load top ordered products.'
      } finally {
        this.loadingTopOrdered = false
      }
    },
  },
})