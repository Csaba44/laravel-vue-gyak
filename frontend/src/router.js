import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "./stores/user";

// Eager loaded routes
import HomeView from "./views/HomeView.vue";

// Lazy loaded routes
const LoginView = () => import("./views/LoginView.vue");
const RegisterView = () => import("./views/RegisterView.vue");
const NotFoundView = () => import("./views/NotFoundView.vue");
const MyOrdersView = () => import("./views/MyOrdersView.vue");

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/register", name: "register", component: RegisterView },
  { path: "/login", name: "login", component: LoginView },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView }, // 404 not found https://router.vuejs.org/guide/essentials/dynamic-matching.html#Catch-all-404-Not-found-Route
  { path: "/my-orders", meta: { requiresAuth: true }, name: "myOrders", component: MyOrdersView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  if (!userStore.isUserLoaded) {
    await userStore.fetchUser();
  }

  if (to.meta.requiresAuth) {
    await userStore.fetchUser();
    if (!userStore.isAuthenticated) return next("/login");
  }

  if (from.name === "login") {
    try {
      await userStore.fetchUser(); 
    } catch (err) {
      console.error("Failed to fetch user:", err);
      return next("/login");
    }
  }
  next();
});
export default router;
