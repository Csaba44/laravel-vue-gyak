import { defineStore } from "pinia";
import { useProductStore } from "./product";

export const useBasketStore = defineStore("basket", {
  state: () => ({
    products: [],
  }),
  actions: {
    addProduct(id, count) {
      var index = -1;
      this.products.find(function (item, i) {
        if (item.product_id === id) {
          index = i;
          return i;
        }
      });

      const productStore = useProductStore();
      const maxCount = productStore.getMaxProductCount(id);
      if (maxCount < 0) return; // -1 ha a products null, -2 ha nincs olyan product

      if (index !== -1) {
        if (this.products[index].count < maxCount) this.products[index].count++;
        else return false;
      } else {
        if (maxCount >= 1) this.products.push({ product_id: id, count: count });
        else return false;
      }

      return true;
    },
    getCount(id) {
      const product = this.products.find((p) => p.product_id == id);

      if (!product) return -1;

      return product.count;
    },
  },
});
