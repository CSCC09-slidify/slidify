<template>
  <v-app>
    <UserSessionModal v-if="loginRequired == 'session'" :onSignIn="reload" header="Session Expired"
      headerIcon="mdi-clock-outline"
      body="To continue, click the button below to sign in, or return to the homepage." />
    <UserSessionModal v-if="loginRequired == 'signout'" :onSignIn="reload" header="Sign In" headerIcon="mdi-account"
      body="You must be signed in to view this page." />
    <v-navigation-drawer v-if="isAuthenticated && showMainLayout" v-model="drawer" class="d-flex flex-column"
      :style="{ background: $vuetify.theme.themes.slidifyTheme.colors.surface }">
      <SlidesHistory :slidesHistory="slidesHistory" />
      <template v-slot:append>
        <div v-if="activeJob && activeJob.jid" class="d-flex flex-column justify-center ">
          <v-divider></v-divider>
          <v-list-item @click="goToCreate" color="primary" class="pa-4" link
            :title="activeJob.title ? `In Progress: ${activeJob.title}` : '1 Job in Progress...'">
          </v-list-item>
        </div>
        <div v-else class="d-flex justify-center pa-4">
          <v-btn @click="goToCreate" color="primary" rounded="xl" prepend-icon="mdi-plus" class="text-lowercase w-100">
            slideshow
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar class="px-1" color="white" flat v-if="isAuthenticated && showMainLayout">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <v-btn icon><v-icon>mdi-menu</v-icon></v-btn>
      </v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" class="text-decoration-none">Slidify</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <AccountSettingsButton />
      <v-btn @click="toggleNotifications" id="notification-activator"
        :icon="notification.active ? 'mdi-bell-badge' : 'mdi-bell'"></v-btn>
      <NotificationList activator="#notification-activator" :content="notification.content"
        :isOpened="notification.isOpen" :clearNotifications="clearNotifications" :onClose="closeNotifications" />
    </v-app-bar>
    <v-main>
      <router-view :key="forceReload" @job-started="onJobStarted"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import SlidesHistory from "@/components/SlidesHistory.vue";
import NotificationList from "@/components/NotificationList.vue";
import UserSessionModal from "@/components/UserSessionModal.vue";
import AccountSettingsButton from "@/components/AccountSettingsButton.vue";
import apiService from "@/services/api.service";
import { websocket } from "@/services/socket.service";
import { useRoute } from "vue-router";
import { watch } from "vue";
import { googleLogin, googleLogout } from "@/tools/users.js";

export default {
  name: "MainLayout",
  components: {
    SlidesHistory,
    NotificationList,
    UserSessionModal,
    AccountSettingsButton,
  },
  data: () => ({
    isAuthenticated: false,
    drawer: false,
    slidesHistory: [],
    notification: {
      active: false,
      isOpen: false,
      content: [],
    },
    waitingForPresentation: false,
    loginRequired: "none",
    showMainLayout: false,
    accountSettings: false,
    activeJob: null,
    forceReload: 0,
  }),
  watch: {
    isAuthenticated: {
      deep: true,
      handler() {
        this.fetchSlidesHistory();
        this.fetchActiveJob();
        if (this.isAuthenticated) {
          this.fetchNotifications();
          this.watchNotifications();
          this.showMainLayout = this.$route.name != "landing";
        } else {
          this.slidesHistory = [];
          this.notification = {
            active: false,
            isOpen: false,
            content: [],
          };
          this.waitingForPresentation = false;
          this.showMainLayout = false;
        }
      },
    },
    drawer: {
      deep: true,
      handler() {
        this.fetchSlidesHistory();
        this.fetchActiveJob();
      },
    },
  },
  methods: {
    forceReloadRoute() {
      this.forceReload++;
    },
    goToCreate() {
      if (this.$router.currentRoute.value.path === "/create") {
        this.forceReloadRoute();
      } else {
        this.$router.push("/create");
      }
    },
    login() {
      googleLogin(() => {
        this.reload();
      });
    },
    logout() {
      googleLogout(() => {
        this.updateAuthStatus();
        this.$router.push("/");
      });
    },
    updateAuthStatus(next = () => { }) {
      apiService.whoami().then((response) => {
        this.isAuthenticated = Boolean(response.userId);
        next();
      })
      .catch(() => {
        this.isAuthenticated = false;
        next();
      });
    },
    fetchSlidesHistory() {
      apiService.getSlides().then((response) => {
        if (response.presentations) {
          this.slidesHistory = response.presentations;
        } else {
          this.slidesHistory = [];
        }
      });
    },
    fetchActiveJob() {
      return apiService.getSlideJobs().then((response) => {
        console.log(response);
        if (response.total > 0) {
          this.activeJob = response.jobs[0];
        } else {
          this.activeJob = null;
        }
        console.log(this.activeJob);
      });
    },
    fetchNotifications() {
      if (this.isAuthenticated) {
        apiService.fetchNotifications().then((d) => {
          if (d.totalCount > 0) {
            this.notification.active = true;
            this.notification.content = d.notifications.map((n) => ({
              text: n.content.title,
              date: n.date,
              link:
                n.type == "presentation"
                  ? `/presentations/${n.content.presentationId}`
                  : "",
            }));
          }
        });
      }
    },
    closeNotifications() {
      this.notification.active = false;
    },
    watchNotifications() {
      apiService.whoami().then((res) => {
        if (this.isAuthenticated && res.userId) {
          websocket.on(`notification/${res.userId}/new`, (r) => {
            this.notification.content.splice(0, 0, {
              text: r.content.title,
              date: r.date,
              link:
                r.type == "presentation"
                  ? `/presentations/${r.content.presentationId}`
                  : "",
            });
            this.notification.active = true;
            if (r.type == "presentation") {
              this.waitingForPresentation = false;
              this.fetchSlidesHistory();
              this.fetchActiveJob();
            }
          });
        } else {
          websocket.removeAllListeners();
        }
      });
    },
    clearNotifications() {
      if (this.isAuthenticated) {
        apiService.clearNotifications().then(() => {
          this.notification.content = [];
        });
      }
    },
    displayLogin(route = this.$route) {
      const previousValue = this.isAuthenticated;
      this.updateAuthStatus(() => {
        if (route && route.path == "/") {
          this.loginRequired = "none";
        } else if (previousValue && !this.isAuthenticated) {
          this.loginRequired = "session";
        } else if (!previousValue && !this.isAuthenticated) {
          this.loginRequired = "signout";
        } else {
          this.loginRequired = "none";
        }
      });
    },
    reload() {
      this.$router.go(0);
    },
    onJobStarted(title) {
      this.fetchActiveJob().then(() => {
        this.activeJob.title = title;
      });
    },
  },

  created() {
    this.drawer = !this.$vuetify.display.mobile;
    this.updateAuthStatus(this.displayLogin);
    this.fetchSlidesHistory();
    this.fetchActiveJob();
    const route = useRoute();
    watch(route, (to) => {
      console.log("Change route");
      console.log(to);
      this.showMainLayout = to.name != "landing";
      this.updateAuthStatus(() => this.displayLogin(to));
    });
  },
};
</script>

<style>
a {
  text-decoration: none;
  color: rgb(117, 0, 98);
}

h1 {
  font-size: 1.5rem;
  font-weight: 500;
}

h2 {
  font-size: 1.25rem;
}

h3 {
  font-size: 1.125rem;
}

h4 {
  font-size: 1rem;
}
</style>
