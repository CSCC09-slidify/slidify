<template>
  <v-app>
    <v-navigation-drawer v-model="drawer"
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
    <v-app-bar class="px-1" color="white" prominent>
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
    <v-main class="ma-5">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import SlidesHistory from "@/components/SlidesHistory.vue";
import NotificationList from "@/components/NotificationList.vue";
import apiService from "@/services/api.service";
import { googleSdkLoaded } from "vue3-google-login";
import { websocket } from "@/services/socket.service";
import { useRoute } from "vue-router";
import { watch } from "vue";

export default {
  name: "MainLayout",
  components: {
    SlidesHistory,
    NotificationList
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
    waitingForPresentation: false
  }),
  watch: {
    isAuthenticated: {
      deep: true,
      handler(){
        this.fetchSlidesHistory();
        if (this.isAuthenticated) {
            this.fetchNotifications();
            this.watchNotifications();
        } else {
            this.slidesHistory = []
            this.notification = {
                active: false,
                isOpen: false,
                content: []
            }
            this.waitingForPresentation = false;
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
      console.log(process.env)
      googleSdkLoaded(google => {
        google.accounts.oauth2.initCodeClient({
          client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
          scope: "email profile openid https://www.googleapis.com/auth/presentations",
          redirect_uri: process.env.VUE_APP_GOOGLE_REDIRECT_URI,
          include_granted_scopes: false,
          callback: response => {
            if (response.code) {
              apiService.signIn(response.code).then((response) => {
                console.log(response);
                this.updateAuthStatus();
              })
            }
          }
        }).requestCode();
      });
    },
    logout() {
      apiService.signOut().then((response) => {
        console.log(response);
        this.updateAuthStatus();
      });
    },
    updateAuthStatus() {
      apiService.whoami().then((response) => {
        this.isAuthenticated = Boolean(response.userId);
        console.log(response)
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
                            link: r.type == "presentation" ? `presentations/${r.content.presentationId}` : ""
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
    }
  },
  created() {
    this.updateAuthStatus();
    const route = useRoute();
    watch(route, (to) => {
        console.log("Change route")
        console.log(to)
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
