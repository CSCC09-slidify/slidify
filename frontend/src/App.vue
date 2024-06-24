<template>
  <v-layout>
    <v-app-bar color="white" prominent>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <v-btn icon><v-icon>mdi-history</v-icon></v-btn>
      </v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" class="text-decoration-none"> Slidify </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn text>
        <router-link to="/login" class="text-decoration-none">
          Log In
        </router-link>
      </v-btn>
      <v-btn text>
        <router-link to="/login" class="text-decoration-none">
          Sign Up
        </router-link>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'top' : start"
    >
      <v-list :items="slidesHistory"></v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-layout>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    drawer: false,
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
      {
        title: "Generated Slides 3",
        value: "slide3",
      },
      {
        title: "Generated Slides 4",
        value: "slide4",
      },
    ],
  }),
};
</script>
