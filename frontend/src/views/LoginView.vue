<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import api from "../../api";
import Button from "../components/Button.vue";
import Input from "../components/Input.vue";
import Alert from "../components/Alert.vue";
import Loading from "../components/Loading.vue";
import { useUserStore } from "../stores/user";
import router from "../router";


const formData = ref({
  email: "teszt.elek@gmail.com",
  password: "tesztelek123",
});

const errors = ref([]);
const success = ref(null);
const loading = ref(null);

const formSubmitted = async () => {
  errors.value = [];
  success.value = null;

  try {
    loading.value = "Bejelentkezés folyamatban...";
    const csrf = await api.get("/sanctum/csrf-cookie");
    console.log("csrf", csrf);

    const response = await api.post("/login", formData.value);
    if (response.status == 200) {
      success.value = response.data.message;
      router.push("/");
    };
    console.log("login", response);
  } catch (error) {
    console.log(error);
    const errs = error.response.data.errors;
    if (error.response && error.response.status == 422) {
      for (const key in errs) {
        errors.value.push(errs[key][0]);
      }
    } else if (error.response && error.response.status == 401) {
      errors.value.push(error.response.data.message);
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

      <Input class="mt-3" :disabled="loading !== null" name="email" type="email" label="Email cím: " placeholder="gipsz.jakab@gmail.com" v-model="formData.email" />
      <Input :disabled="loading !== null" name="password-first" type="password" label="Jelszó: " placeholder="***" v-model="formData.password" />
      <div class="w-full flex justify-center mt-3"><Button :disabled="loading !== null" type="submit">Bejelentkezés</Button></div>
    </form>
  </div>
</template>
