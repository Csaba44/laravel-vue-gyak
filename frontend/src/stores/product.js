import { defineStore } from "pinia";
import api from "../../api";

export const useProductStore = defineStore("product", {
  state: () => ({
    isLoaded: false,
    products: null,
    error: null,
  }),
  actions: {
    async fetchProducts() {
      try {
        const response = await api.get("/products");
        this.products = response.data;
      } catch (error) {
        this.products = null;
        this.error = "Hiba történt: " + error;
      } finally {
        this.isLoaded = true;
      }
    },
    getMaxProductCount(productId) {
      if (this.products == null) return -1;
      const product = this.products.filter((p) => p.id == productId)[0];
      if (!product) return -2;

      return product.stock_count;
    },
    getProductDetails(productId) {
      if (this.products == null) return -1;
      const product = this.products.filter((p) => p.id == productId)[0];
      return product;
    },
  },
});
