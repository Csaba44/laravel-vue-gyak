import { createRouter, createWebHistory } from "vue-router";

// Eager loaded routes
import HomeView from "./views/HomeView.vue";

// Lazy loaded routes
const LoginView = () => import("./views/LoginView.vue");

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/login", name: "login", component: LoginView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});
export default router;
