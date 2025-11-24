<script setup>
const EXCLUDE_NAV = ['login', 'register'];
</script>

<template>
  <nav v-show="!EXCLUDE_NAV.includes($route.name)">
    <RouterLink to="/">Go to Home</RouterLink>
    <br>
    <RouterLink to="/login">Go to About</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>