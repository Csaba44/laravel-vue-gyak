<script setup>
import { onBeforeMount, ref } from 'vue';
import { useUserStore } from '../stores/user';
import api from '../../api';
const userStore = useUserStore();

const orders = ref([]);

onBeforeMount(async () => {
  try {
    const response = await api.get("/orders");
    console.log(response);
    orders.value = response.data
  } catch (error) {
    console.error(error);
  }
});


</script>

<template>
  <div class="mt-10 border-1">
    <p v-for="order in orders" :key="order.id">{{ order.address }} - {{ order.status }}</p>
  </div>
</template>