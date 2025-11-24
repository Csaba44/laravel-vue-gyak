<script setup>
import { ref } from "vue";
import axios from "axios";
import Button from "../components/Button.vue";
import Input from "../components/Input.vue";
import Alert from "../components/Alert.vue";
import Loading from "../components/Loading.vue";

const formData = ref({
  name: "Teszt Elek",
  email: "teszt.elek@gmail.com",
  password: "tesztelek123",
  password2: "tesztelek123",
});

const errors = ref([]);
const success = ref(null);
const loading = ref(null);

const formSubmitted = async () => {
  errors.value = [];
  success.value = null;

  try {
    loading.value = "Fiók létrehozása...";
    const response = await axios.post("http://127.0.0.1:8000/api/register", formData.value);
    if (response.status == 201) success.value = response.data.message;
  } catch (error) {
    if (error.response.status == 422) {
      const errs = error.response.data.errors;
      for (const key in errs) {
        errors.value.push(errs[key][0]);
      }
    } else {
      errors.value.push("Ismeretlen hiba történt.");
    }
  } finally {
    loading.value = null;
  }
};
</script>

<template>
  <div class="h-screen w-screen bg-slate-100 flex justify-center items-center">
    <form @submit.prevent="formSubmitted" class="bg-gray-400 text-center flex flex-col gap-2 py-3 px-8 rounded-md">
      <h1 class="font-bold text-2xl">Regisztráció</h1>

      <Alert type="error" v-for="error in errors" :key="error">{{ error }}</Alert>
      <Alert type="success" v-show="success">{{ success }}</Alert>
      <Loading v-if="loading !== null">{{ loading }}</Loading>

      <Input :disabled="loading !== null" class="mt-3" name="name" label="Teljes név: " placeholder="Gipsz Jakab" v-model="formData.name" />
      <Input :disabled="loading !== null" name="email" type="email" label="Email cím: " placeholder="gipsz.jakab@gmail.com" v-model="formData.email" />
      <Input :disabled="loading !== null" name="password-first" type="password" label="Jelszó: " placeholder="***" v-model="formData.password" />
      <Input :disabled="loading !== null" name="password-twice" type="password" label="Jelszó 2x: " placeholder="***" v-model="formData.password2" />
      <div class="w-full flex justify-center mt-3"><Button :disabled="loading !== null" type="submit">Regisztráció</Button></div>
    </form>
  </div>
</template>
