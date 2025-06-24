import { defineStore } from 'pinia';
import axios from 'axios';

export const useSearchStore = defineStore('search', {
  state: () => ({
    categories: [],
    selectedCategory: null,
    searchTerm: '',
    results: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('https://ecom-1qve.onrender.com/api/products/category/list');
        this.categories = response.data;
      } catch {
        this.error = 'Failed to fetch categories.';
      } finally {
        this.loading = false;
      }
    },
    setCategory(categoryId) {
      this.selectedCategory = categoryId;
    },
    setSearchTerm(term) {
      this.searchTerm = term;
    },
    async searchProducts() {
      this.loading = true;
      this.error = null;
      try {
        let params = {};
        if (this.selectedCategory) params.category = this.selectedCategory;
        if (this.searchTerm) params.search = this.searchTerm;
        const response = await axios.get('https://ecom-1qve.onrender.com/api/products/list', { params });
        this.results = response.data;
        console.log(response);
      } catch {
        this.error = 'Failed to fetch products.';
      } finally {
        this.loading = false;
      }
    },
  },
}); 