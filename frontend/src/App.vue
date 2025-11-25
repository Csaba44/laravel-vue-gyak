<script setup>
import { onBeforeMount, watch } from "vue";
import { useUserStore } from "./stores/user";
import Button from "./components/Button.vue";
import api from "../api";
import router from "./router";
const EXCLUDE_NAV = ["login", "register"];

const userStore = useUserStore();

onBeforeMount(async () => {
  await userStore.fetchUser();
});


const logOut = async () => {
  try {
    const success = await userStore.logout();
    if (success) router.push("/login");
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <nav v-show="!EXCLUDE_NAV.includes($route.name)">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/my-orders">My orders</RouterLink>
    <br />
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/register">Register</RouterLink>
    <Button @click="logOut" class="ml-5">Log out</Button>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
