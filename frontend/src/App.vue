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
import apiService from "@/services/api.service";
import { googleSdkLoaded } from "vue3-google-login";

export default {
  name: "App",
  components: {
    SlidesHistory
  },
  data: () => ({
    isAuthenticated: false,
    drawer: true,
    // TODO: fetch this dynamically
    slidesHistory: [],
    currentSlide: ""
  }),
  watch: {
    isAuthenticated: {
      deep: true,
      handler(){
        this.fetchSlidesHistory();
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
    }
  },
  created() {
    this.updateAuthStatus();
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
</style>
