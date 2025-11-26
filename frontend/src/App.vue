<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useUserStore } from "./stores/user";
import Button from "./components/Button.vue";
import api from "../api";
import router from "./router";
const EXCLUDE_NAV = ["login", "register"];

const userStore = useUserStore();

const userData = ref(null);

onBeforeMount(async () => {
  await userStore.fetchUser();
  if (userStore.isAuthenticated) userData.value = userStore.user;
});

const logOut = async () => {
  try {
    const success = await userStore.logout();
    if (success) router.push("/login");
  } catch (error) {
    console.error(error);
  }
};


watch(
  () => userStore.userData,
  () => {
    if (userStore.isAuthenticated) userData.value = userStore.user;
  },
  {deep: true}
);
</script>

<template>
  <nav v-show="!EXCLUDE_NAV.includes($route.name)" class="bg-slate-300 grid gap-10 items-center grid-cols-2 w-full py-2">
    <div class="flex">
      <RouterLink class="text-nowrap mr-4" to="/">Home</RouterLink>
      <RouterLink class="text-nowrap mr-4" to="/my-orders">My orders</RouterLink>
      <template v-if="userData === null">
        <RouterLink class="text-nowrap mr-4 font-medium" to="/login">Login</RouterLink>
        <RouterLink class="text-nowrap mr-4 font-medium" to="/register">Register</RouterLink>
      </template>
    </div>

    <div class="flex justify-end items-center gap-5">
      <p>Szia, {{ userData?.name ?? "?"}}</p>
      <Button v-if="userData !== null" @click="logOut" class="mr-4"> Log out </Button>
    </div>
  </nav>

  <main>
    <RouterView />
  </main>
</template>
