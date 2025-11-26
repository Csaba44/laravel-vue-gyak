<script setup>
import Button from "./Button.vue";
import { useBasketStore } from "../stores/basket";
import { computed, ref } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const basketStore = useBasketStore();
const limitReached = ref(false);

const SOLD_OUT_COLOR = "text-red-500";
const FEW_LEFT_COLOR = "text-amber-500";
const IN_STOCK_COLOR = "text-green-500";

let stockText = props.product.stock_count <= 0 ? "Elfogyott" : "Elérhető";
if (props.product.stock_count <= 10 && props.product.stock_count > 0) stockText = "Hamarosan elfogyik";

let stockColor = props.product.stock_count <= 0 ? SOLD_OUT_COLOR : IN_STOCK_COLOR;
if (props.product.stock_count <= 10 && props.product.stock_count > 0) stockColor = FEW_LEFT_COLOR;

const basketProductCount = computed(() => {
  const c = basketStore.getCount(props.product.id);
  if (c == -1) return 0; // Ha nincs ilyen termék
  return c;
});

const addProduct = () => {
  const addResult = basketStore.addProduct(props.product.id, 1); // False = hozzáadtuk mindet
  if (!addResult) limitReached.value = true;
};
</script>

<template>
  <div class="border border-1 border-black p-5">
    <h1 class="text-xl">{{ product.name }}</h1>
    <p class="font-bold">{{ product.price }} Ft</p>
    <p :class="'font-medium' + ' ' + stockColor">{{ stockText }}</p>
    <div class="w-full flex justify-center mt-5">
      <Button :disabled="props.product.stock_count <= 0 || limitReached" @click="addProduct()">{{limitReached ? "Elérte a maximumot" : "Kosárhoz"}} ({{ basketProductCount }})</Button>
    </div>
  </div>
</template>
