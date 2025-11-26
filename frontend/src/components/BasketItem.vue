<script setup>
import { computed, ref } from "vue";
import { useProductStore } from "../stores/product";
import Input from "./Input.vue";
import { useBasketStore } from "../stores/basket";

const props = defineProps({
  productId: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const productStore = useProductStore();
const basketStore = useBasketStore();

const productDetails = computed(() => productStore.getProductDetails(props.productId));
const maxCount = productStore.getMaxProductCount(productDetails.value.id);

const count = ref(props.count);
</script>

<template>
  <div class="bg-slate-100 grid grid-cols-2 rounded-md p-2 items-center">
    <h2 class="text-lg">{{ productDetails.name }}</h2>
    <form @submit.prevent="count <= maxCount && basketStore.setItemCount(props.productId, count)" class="w-full flex justify-end items-center gap-2">
      <p>{{ productDetails.price * count }} Ft</p>
      <span> - </span>
      <Input min="0" :max="maxCount" type="number" v-model="count" name="product_count"></Input><span>db</span>
    </form>
  </div>
</template>
