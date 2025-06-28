import { defineStore } from 'pinia'
import axios from 'axios'

export const useSearchStore = defineStore('search', {
  state: () => ({
    categories: [],
    selectedCategory: null,
    searchTerm: '',
    results: [],
    count: 0,
    next: null,
    previous: null,
    page: 1,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('https://ecom-shoe-b2nx.onrender.com/api/products/category/list')
        this.categories = response.data
      } catch {
        this.error = 'Failed to fetch categories.'
      } finally {
        this.loading = false
      }
    },

    setCategory(categoryId) {
      this.selectedCategory = categoryId
    },

    setSearchTerm(term) {
      this.searchTerm = term
    },

    setPage(page) {
      this.page = page
    },

    async searchProducts(params = {}) {
      this.loading = true
      this.error = null

      try {
        // Build query from provided params or fallback to store state
        const query = { ...params }
        if (!query.category && this.selectedCategory)
          query.category = this.selectedCategory
        if (!query.search && this.searchTerm)
          query.search = this.searchTerm
        if (!query.page && this.page)
          query.page = this.page

        const response = await axios.get('https://ecom-shoe-b2nx.onrender.com/api/products/list', {
          params: query,
        })

        const data = response.data

        // Only main image for listings
        if (data && Array.isArray(data.results)) {
          this.results = data.results.map(product => ({
            ...product,
            image: product.main_image_url // use only main image
          }))
          this.count = data.count
          this.next = data.next
          this.previous = data.previous
        } else {
          this.results = (data || []).map(product => ({
            ...product,
            image: product.main_image_url
          }))
          this.count = data.length || 0
          this.next = null
          this.previous = null
        }
      } catch {
        this.error = 'Failed to fetch products.'
      } finally {
        this.loading = false
      }
    },
  },
})
