<script setup>
import { reactive, ref } from 'vue';
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';

const formData = reactive({
  fullName: '',
  email: '',
  password1: '',
  password2: ''
});


const formSubmitted = () => {
  console.log(formData);
};
</script>

<template>
  <div class="h-screen w-screen flex justify-center items-center">
    <form @submit.prevent="formSubmitted" class="bg-gray-400 text-center flex flex-col gap-2 py-3 px-8 rounded-md">
      <h1 class="font-bold text-2xl">Regisztráció</h1>
      <Input class="mt-3" name="fullname" label="Teljes név: " placeholder="Gipsz Jakab" v-model="formData.fullName" />
      <Input name="email" type="email" label="Email cím: " placeholder="gipsz.jakab@gmail.com" v-model="formData.email" />
      <Input name="password-first" type="password" label="Jelszó: " placeholder="***" v-model="formData.password1" />
      <Input name="password-twice" type="password" label="Jelszó 2x: " placeholder="***" v-model="formData.password2" />
      <Button type="submit">Regisztráció</Button>
    </form>
  </div>
</template>
