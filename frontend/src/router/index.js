import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PresentationView from "../views/PresentationView.vue";
import MainLayoutView from "../views/MainLayoutView.vue";
import LandingView from "../views/LandingView.vue";
// import apiService from "@/services/api.service";

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
          meta: { requiresAuth: true },
        },
        {
          path: "/presentations/:presentationId",
          name: "presentation",
          component: PresentationView,
          meta: { requiresAuth: true },
        },
        {
          path: "/",
          name: "landing",
          component: LandingView,
        },
      ],
    },
  ],
});

/* Implement a global navigation guard that checks if the user is authenticated before navigating to a route that requires authentication. */
// router.beforeEach((to, from, next) => {
//   apiService.whoami().then((res) => {
//     const authenticated = !!res.userId;
//     if (to.matched.some(record => record.meta.requiresAuth) && !authenticated) {
//       next({ name: 'landing' });
//     } else {
//       next();
//     }
//   });
// });

export default router;
