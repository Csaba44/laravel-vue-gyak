<script setup>
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../stores/user";
import api from "../../api";
import Loading from "../components/Loading.vue";
import Alert from "../components/Alert.vue";
import ProductCard from "../components/ProductCard.vue";
import { useProductStore } from "../stores/product";
import Button from "../components/Button.vue";
import { useBasketStore } from "../stores/basket";
import router from "../router";


const userStore = useUserStore();
const productStore = useProductStore();
const basketStore = useBasketStore();

const products = ref(null);
const error = ref(null);

onBeforeMount(async () => {
  await productStore.fetchProducts();
  if (productStore.error) return (error.value = productStore.error);

  products.value = productStore.products;
});
</script>

<template>
  <Loading v-if="products == null && error == null">Termékek betöltése</Loading>
  <Alert type="error" v-if="error !== null">{{ error }}</Alert>

  <div class="p-5">
    <Button @click="router.push('/basket')">Kosár megtekintése ({{ basketStore.getBasketItemCountSum() }} db)</Button>
  </div>
  <div class="grid grid-cols-4 gap-5 p-5">
    <ProductCard v-for="product in products" :key="product.id" :product="product" />
  </div>
</template>
