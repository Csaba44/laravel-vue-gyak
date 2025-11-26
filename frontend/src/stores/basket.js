import { defineStore } from "pinia";

export const useBasketStore = defineStore("basket", {
  state: () => ({
    products: [],
  }),
  actions: {
    addProduct(id, count) {
      var index = -1;
      this.products.find(function (item, i) {
        if (item.id === id) {
          index = i;
          return i;
        }
      });

      if (index !== -1) {
        this.products[index].count++;
      } else {
        const newBasketItem = { id, count };

        this.products.push(newBasketItem);
      }

      console.log(this.products);
    },
    getCount(id) {
      const product = this.products.find((p) => p.id == id);

      if (!product) return -1;

      return product.count;
    }
  },
});
