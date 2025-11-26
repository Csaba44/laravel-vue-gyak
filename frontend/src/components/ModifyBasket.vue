<script setup>
import { computed } from "vue";
import { useBasketStore } from "../stores/basket";
import BasketItem from "./BasketItem.vue";
import Button from "./Button.vue";
import { useUserStore } from "../stores/user";
import router from "../router";

const basketStore = useBasketStore();

const emit = defineEmits(["next-stage"]);

const userStore = useUserStore();
</script>

<template>
  <div>
    <div v-if="basketStore.products.length > 0" class="flex flex-col gap-3 mt-4">
      <BasketItem v-for="product in basketStore.products" :key="product.product_id" :product-id="product.product_id" :count="product.count" />

      <div class="mt-2">
        <h1 class="text-xl">Összesen</h1>
        <p class="text-lg font-bold">{{ basketStore.getBasketValue() }} Ft</p>
      </div>

      <Button @click="userStore.isAuthenticated ? emit('next-stage') : router.push('/login')">Következő</Button>
    </div>
    <div v-else>
      <p>A kosár üres.</p>
    </div>

    
  </div>
</template>
