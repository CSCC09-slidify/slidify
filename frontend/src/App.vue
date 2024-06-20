<template>
  <v-layout>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <v-btn icon><v-icon>mdi-history</v-icon></v-btn>
      </v-app-bar-nav-icon>

      <v-toolbar-title>Slidify</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
    >
      <v-list :items="slidesHistory"></v-list>
    </v-navigation-drawer>

    <v-main>
      <VideoUpload />
      <GoogleSlides />
    </v-main>
  </v-layout>
</template>

<script>
import VideoUpload from "./components/VideoUpload.vue";
import GoogleSlides from "./components/GoogleSlides.vue";

export default {
  name: "App",
  components: {
    VideoUpload,
    GoogleSlides,
  },
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
