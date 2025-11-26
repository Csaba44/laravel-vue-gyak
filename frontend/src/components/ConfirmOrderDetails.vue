<script setup>
import Input from "./Input.vue";
import Button from "./Button.vue";
import api from "../../api";
import { useBasketStore } from "../stores/basket";
import { ref } from "vue";
import Loading from "./Loading.vue";
import Alert from "./Alert.vue";

const emit = defineEmits(["next-stage"]);
const basketStore = useBasketStore();

const formData = ref({ postalCode: null, address: "" });

const loading = ref(null);

const errors = ref([]);

const finishOrder = async () => {
  errors.value = [];
  if (formData.value.postalCode == null || formData.value.address.trim() == "") return errors.value.push("Kérlek tölts ki minden mezőt.");
  try {
    loading.value = "Rendelés leadása";
    const result = await api.post("/orders", {
      postal_code: formData.value.postalCode.toString(),
      address: formData.value.address,
      products: basketStore.products,
    });
    console.log(result);

    if (result.status === 201) {
      emit("next-stage");
      return;
    } else {
      errors.value.push("Ismeretlen hiba történt.");
      return;
    }
  } catch (error) {
    if (!error.response) {
      errors.push("Ismeretlen hiba történt. Ellenőrizze az internetkapcsolatát.");
    } else if (error.response.status === 422) {
      const apiErrors = error.response.data.errors;
      for (const key in apiErrors) {
        errors.value.push(apiErrors[key][0]);
      }
    }
  } finally {
    loading.value = null;
  }
};
</script>

<template>
  <div class="w-full mt-10 flex justify-center items-center">
    <Loading v-if="loading">{{ loading }}</Loading>
    <form class="flex flex-col gap-5">
      <Alert type="error" v-for="error in errors" :key="error">{{ error }}</Alert>
      <Input name="postalCode" v-model="formData.postalCode" placeholder="1234" label="Irányítószám" type="number" />
      <Input name="address" v-model="formData.address" placeholder="Kossuth u. 1." label="Cím" />

      <Button @click="finishOrder()">Rendelés leadása</Button>
    </form>
  </div>
</template>
