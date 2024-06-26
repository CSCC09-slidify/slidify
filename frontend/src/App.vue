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
      <GoogleLogin :callback="handleSignIn" class="mr-2"></GoogleLogin>
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
// import { decodeCredential } from 'vue3-google-login'

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
    handleSignIn(response) {
      // const userData = decodeCredential(response.credential)
      apiService.signIn(response.credential).then((response) => {
        console.log(response);
      })
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
