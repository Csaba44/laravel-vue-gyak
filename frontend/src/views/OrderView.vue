<script setup>
import { computed, onBeforeMount, provide, ref } from "vue";
import { useRoute } from "vue-router";
import api from "../../api";
import Alert from "../components/Alert.vue";
import router from "../router";
import Loading from "../components/Loading.vue";

const route = useRoute();
const currentOrderId = route.params.id;
const currentOrderDetails = ref(null);

const loading = ref(null);
const error = ref(null);

onBeforeMount(async () => {
  try {
    loading.value = "Rendelés betöltése";
    const result = await api.get("/orders/" + currentOrderId);
    if (result.status === 200) {
      currentOrderDetails.value = result.data;
      console.log(currentOrderDetails.value);
    }
  } catch (err) {
    if (!err.response) {
      error.value = "Ismeretlen hiba. Ellenőrizze az internetkapcsolatot.";
    } else if (err.response.status === 404) {
      error.value = "Ismeretlen rendelés. Visszairányítjuk a főoldalra 5 másodpercen belül.";
      setTimeout(() => {
        router.push("/");
      }, 5000);
    } else {
      error.value = "Ismeretlen hiba történt: " + err;
    }
  } finally {
    loading.value = null;
  }
});

const priceSum = computed(() => {
  if (loading.value || currentOrderDetails.value === null) return null;
  let sum = 0;
  currentOrderDetails.value.products.forEach((product) => {
    sum += product.price * product.pivot.count;
  });
  return sum;
});
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md mt-5">
    <Alert v-if="error" type="error" class="mb-4">{{ error }}</Alert>
    <Loading v-if="loading">{{ loading }}</Loading>
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Rendelés #{{ currentOrderId }}</h1>

    <div class="flex flex-col mt-4" v-if="!loading && currentOrderDetails !== null">
      <p class="text-lg font-semibold mb-2 text-gray-700">Szállítási cím:</p>
      <p class="mb-5 text-gray-600">{{ currentOrderDetails?.address }}</p>

      <p class="text-lg font-semibold mb-2 text-gray-700">Termékek:</p>
      <div class="flex flex-col space-y-2 mb-5">
        <p v-for="product in currentOrderDetails.products" :key="product.id" class="text-gray-700 bg-gray-50 rounded px-4 py-2 shadow-sm hover:bg-gray-100">
          {{ product.name }} - <span class="font-medium">{{ product.price }} Ft</span>
        </p>
      </div>

      <p class="text-lg font-semibold mb-2 text-gray-700">Státusz:</p>
      <p class="mb-5 text-indigo-600 font-semibold">{{ currentOrderDetails.status }}</p>

      <p class="text-xl font-bold border-t pt-4 text-gray-900">
        Összes fizetendő: <span class="text-indigo-700">{{ priceSum }} Ft</span>
      </p>
    </div>
  </div>
</template>
