import { createRouter, createWebHistory } from "vue-router";

// Eager loaded routes
import HomeView from "./views/HomeView.vue";

// Lazy loaded routes
const LoginView = () => import("./views/LoginView.vue");
const NotFoundView = () => import("./views/NotFoundView.vue");

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/login", name: "login", component: LoginView },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView }, // 404 not found https://router.vuejs.org/guide/essentials/dynamic-matching.html#Catch-all-404-Not-found-Route
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});
export default router;
