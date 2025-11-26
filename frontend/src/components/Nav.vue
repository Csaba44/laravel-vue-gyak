<script setup>
import { useUserStore } from "../stores/user";
import Button from "../components/Button.vue";
import router from "../router";

const EXCLUDE_NAV = ["login", "register"];
const userStore = useUserStore();

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
  <nav v-show="!EXCLUDE_NAV.includes($route.name)" class="bg-slate-300 grid gap-10 items-center grid-cols-2 w-full py-2 h-14">
    <div class="flex ml-4">
      <RouterLink class="text-nowrap mr-4" to="/">Home</RouterLink>
      <RouterLink class="text-nowrap mr-4" to="/my-orders">My orders</RouterLink>
      <template v-if="!userStore.isAuthenticated">
        <RouterLink class="text-nowrap mr-4 font-medium" to="/login">Login</RouterLink>
        <RouterLink class="text-nowrap mr-4 font-medium" to="/register">Register</RouterLink>
      </template>
    </div>

    <div class="flex justify-end items-center gap-5">
      <p class="mr-4">Szia, {{ userStore.user?.name ?? "Vendég" }}</p>
      <Button v-if="userStore.isAuthenticated" @click="logOut" class="mr-4">Log out</Button>
    </div>
  </nav>
</template>
