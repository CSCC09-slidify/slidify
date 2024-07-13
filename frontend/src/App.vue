<template>
  <v-app>
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
    <v-navigation-drawer v-if="slidesHistory.length > 0"  v-model="drawer" class="py-2">
      <v-list-item title="My Presentation History" class="font-weight-bold"></v-list-item>
      <v-divider></v-divider>
      <v-list-item v-for="item in slidesHistory" :key="item.value" :title="item.title" :to="`/presentations/${item.value}`">
      </v-list-item>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import apiService from "@/services/api.service";
import { googleSdkLoaded } from "vue3-google-login";

export default {
  name: "App",
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
          this.slidesHistory = response.presentations.map(p => ({
            title: p.title,
            value: p.presentationId
          }));
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
