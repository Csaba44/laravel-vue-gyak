<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useUserStore } from "./stores/user";
import Nav from "./components/Nav.vue";


const userStore = useUserStore();


onBeforeMount(async () => {
  await userStore.fetchUser();
});


</script>

<template>
  <Nav />

  <main>
    <RouterView />
  </main>
</template>
