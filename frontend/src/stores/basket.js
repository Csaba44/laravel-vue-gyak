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
    getBasketItemCountSum() {
      let sum = 0;

      this.products.forEach((product) => {
        sum += product.count;
      });

      return sum;
    },
    setItemCount(productId, newCount) {
      if (newCount < 0) return;

      var index = -1;
      this.products.find(function (item, i) {
        if (item.product_id === productId) {
          index = i;
          return i;
        }
      });

      if (index === -1) return;

      if (newCount > 0) {
        this.products[index].count = newCount;
      } else {
        // Törlés
        this.products.splice(index, 1);
      }
    },
    getBasketValue() {
      const productStore = useProductStore();

      let sum = 0;
      this.products.forEach(basketProduct => {
        const details = productStore.getProductDetails(basketProduct.product_id);
        sum += details.price * basketProduct.count;
      });

      return sum;
    },
  },
});
