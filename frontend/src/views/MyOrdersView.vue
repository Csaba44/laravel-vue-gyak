<script setup>
import { onBeforeMount, ref } from "vue";
import api from "../../api";
import Order from "../components/Order.vue";

const orders = ref([]);

onBeforeMount(async () => {
  try {
    const response = await api.get("/orders");
    console.log(response.data);
    orders.value = response.data;
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div class="p-5 flex flex-col gap-3">
    <h1 class="text-2xl">Rendeléseim</h1>
    <Order v-for="order in orders" :key="order.id" :order="order" />
  </div>
</template>
