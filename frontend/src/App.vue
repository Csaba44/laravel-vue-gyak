<script setup>
const EXCLUDE_NAV = ['login', 'register'];
</script>

<template>
  <nav v-show="!EXCLUDE_NAV.includes($route.name)">
    <RouterLink to="/">Home</RouterLink>
    <br>
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/register">Register</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>