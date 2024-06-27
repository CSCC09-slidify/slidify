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
      <v-btn @click="login">Sign in with Google</v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer">
      <v-list :items="slidesHistory"></v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import apiService from "@/services/api.service";
import { googleAuthCodeLogin } from "vue3-google-login";

export default {
  name: "App",
  data: () => ({
    drawer: true,
    // TODO: fetch this dynamically
    slidesHistory: [
      {
        title: "Generated Slides 1",
        value: "slide1",
      },
      {
        title: "Generated Slides 2",
        value: "slide2",
      },
    ],
  }),
  methods: {
    login() {
      googleAuthCodeLogin().then((response) => {
        apiService.signIn(response.code).then((response) => {
          console.log(response);
        })
      }).catch((error) => {
        console.error("Error logging in with Google:", error);
      });
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
</style>
