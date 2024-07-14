import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PresentationView from "../views/PresentationView.vue";
import LandingView from "../views/LandingView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/upload",
      name: "home",
      component: HomeView,
    },
    {
      path: "/landing",
      name: "landing",
      component: LandingView,
    },
    {
      path: "/presentations/:presentationId",
      name: "presentation",
      component: PresentationView,
    },
  ],
});

export default router;
