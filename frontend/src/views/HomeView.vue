<script setup>
import { useUserStore } from "../stores/user";

const userStore = useUserStore();


</script>

<template>
  <h1>Hi, {{ userStore.user?.name || "Guest" }}</h1>
</template>
