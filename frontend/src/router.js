import { createRouter, createWebHistory } from "vue-router";

import HomeView from "./views/HomeView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/login", name: "login", component: import("./views/LoginView.vue") }, // Lazy loading
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});
export default router;
