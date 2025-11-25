import { defineStore } from "pinia";
import api from "../../api";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isUserLoaded: false,
  }),
  actions: {
    async fetchUser() {
      
      try {
        const response = await api.get("/user");
        this.user = response.data;
        this.isAuthenticated = true;
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
        if (error.response && error.response.status !== 401) {
          console.error(error);
        }
      } finally {
        this.isUserLoaded = true;
      }
    },
    logout() {
      this.user = null;
      this.isAuthenticated = false;
    },
  },
});
