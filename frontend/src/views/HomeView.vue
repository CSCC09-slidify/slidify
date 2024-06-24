<template>
  <VideoUpload />
  <GoogleSlides />
</template>

<script>
import VideoUpload from "../components/VideoUpload.vue";
import GoogleSlides from "../components/GoogleSlides.vue";

export default {
  name: "HomeView",
  components: {
    VideoUpload,
    GoogleSlides,
  },
  data: () => ({}),
};
</script>
