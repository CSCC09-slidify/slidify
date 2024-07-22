<template>
  <v-app>
    <UserSessionModal v-if="loginRequired == 'session'" :onSignIn="reload" header="Session Expired" headerIcon="mdi-clock-outline" body="To continue, click the button below to sign in, or return to the homepage." />
    <UserSessionModal v-if="loginRequired == 'signout'" :onSignIn="reload" header="Sign In" headerIcon="mdi-account"  body="You must be signed in to view this page." />
    <v-navigation-drawer v-if="isAuthenticated" v-model="drawer"
      class="py-2"
      :permanent="!$vuetify.display.mobile"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
      :style="{ background: $vuetify.theme.themes.slidifyTheme.colors.surface }"
    >
      <SlidesHistory :slidesHistory="slidesHistory"/>
      <template v-slot:append>
        <div class="d-flex justify-center pa-4">
          <v-btn to="/upload" color="primary" rounded="xl" prepend-icon="mdi-plus" class="text-lowercase w-100">
            create slideshow
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar class="px-1" color="white" prominent v-if="isAuthenticated">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <v-btn icon><v-icon>mdi-menu</v-icon></v-btn>
      </v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" class="text-decoration-none">Slidify</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-account-circle"></v-btn>
      <v-btn @click="toggleNotifications" id="notification-activator" :icon="notification.active ? 'mdi-bell-badge' : 'mdi-bell'"></v-btn>
      <NotificationList activator="#notification-activator" :content="notification.content" :isOpened="notification.isOpen" :clearNotifications="clearNotifications" :onClose="closeNotifications" />
      <v-btn icon="mdi-dots-vertical"></v-btn>
      <v-btn v-if="isAuthenticated" @click="logout">Sign out</v-btn>
      <v-btn v-else @click="login">Sign in with Google</v-btn>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import SlidesHistory from "@/components/SlidesHistory.vue";
import NotificationList from "@/components/NotificationList.vue";
import UserSessionModal from "@/components/UserSessionModal.vue";
import apiService from "@/services/api.service";
//import { googleSdkLoaded } from "vue3-google-login";
import { websocket } from "@/services/socket.service";
import { useRoute } from "vue-router";
import { watch } from "vue";
import { googleLogin, googleLogout } from "@/tools/users.js";
export default {
  name: "MainLayout",
  components: {
    SlidesHistory,
    NotificationList,
    UserSessionModal
  },
  data: () => ({
    isAuthenticated: false,
    drawer: true,
    slidesHistory: [],
    notification: {
      active: false,
      isOpen: false,
      content: []
    },
    waitingForPresentation: false,
    loginRequired: "none",
    showMainLayout: false
  }),
  watch: {
    isAuthenticated: {
      deep: true,
      handler(){
        this.fetchSlidesHistory();
        if (this.isAuthenticated) {
            this.fetchNotifications();
            this.watchNotifications();
            this.showMainLayout = this.$route.name == "landing"
        } else {
            this.slidesHistory = []
            this.notification = {
                active: false,
                isOpen: false,
                content: []
            }
            this.waitingForPresentation = false;
            this.showMainLayout = false;
        }
      }  
    },
    drawer: {
      deep: true,
      handler(){
        this.fetchSlidesHistory();    
      }
    }
  },
  methods: {
    login() {
      googleLogin(() => {
        this.$router.go(0);
      })
    },
    logout() {
      googleLogout(() => {
        this.updateAuthStatus();
        this.$router.push("/");
      })
    },
    updateAuthStatus(next = () => {}) {
      apiService.whoami().then((response) => {
        this.isAuthenticated = Boolean(response.userId);
        next();
      });
    },
    fetchSlidesHistory() {
      apiService.getSlides().then((response) => {
        if (response.presentations) {
          this.slidesHistory = response.presentations;
        } else {
          this.slidesHistory = []
        }
      })
    },
    fetchNotifications() {
        if (this.isAuthenticated) {

            apiService.fetchNotifications()
                .then(d => {
                    if (d.totalCount > 0) {
                        this.notification.active = true;
                        this.notification.content = d.notifications.map(n => ({
                            text: n.content.title,
                            date: n.date,
                            link: n.type == "presentation" ? `/presentations/${n.content.presentationId}` : ""
                        }));
                    }
                })
            
        }
    },
    closeNotifications() {
      this.notification.active = false;
    },
    watchNotifications() {
        apiService.whoami()
            .then(res => {
                if (this.isAuthenticated && res.userId) {
                    websocket.on(`notification/${res.userId}/new`, (r) => {
                        this.notification.content.splice(0, 0, {
                            text: r.content.title,
                            date: r.date,
                            link: r.type == "presentation" ? `/presentations/${r.content.presentationId}` : ""
                        })
                        this.notification.active = true;
                        if (r.type == "presentation") {
                            this.waitingForPresentation = false;
                            this.fetchSlidesHistory();
                        }
                    })
                } else {
                    websocket.removeAllListeners();
                }
            })
    },
    clearNotifications() {
        if (this.isAuthenticated) {
            apiService.clearNotifications()
                .then(() => {
                    this.notification.content = []
                })
        }
    },
    displayLogin(route) {
      const previousValue = this.isAuthenticated;
      this.updateAuthStatus(
        () => {
          if (route && route.path == "/") {
            this.loginRequired = "none";
          } else if (previousValue && !this.isAuthenticated) {
            this.loginRequired = "session"
          } else if (!previousValue && !this.isAuthenticated) {
            this.loginRequired = "signout"
          } else {
            this.loginRequired = "none"
          }
        }
      )
    },
    reload() {
      this.$router.go(0);
    },
  },

  created() {
    this.updateAuthStatus(this.displayLogin);
    this.fetchSlidesHistory();
    const route = useRoute();
    watch(route, (to) => {
        console.log("Change route")
        console.log(to)
        this.displayLogin(to)
    })
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
</style>
