import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PresentationView from "../views/PresentationView.vue";
import MainLayoutView from "../views/MainLayoutView.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: MainLayoutView,
      children: [
        {
          path: "/upload",
          name: "home",
          component: HomeView,
        },
        {
          path: "/presentations/:presentationId",
          name: "presentation",
          component: PresentationView,
        },
      ]
    }
  ],
});

export default router;
