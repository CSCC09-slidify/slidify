<template>
  <v-row class="align-center justify-center pa-4 h-screen">
    <v-col :style="{ maxWidth: '1000px' }">
      <div class="text-h2 mb-5 d-flex align-center">
        <span class="material-symbols-outlined me-2">
          light_mode
        </span>
        <span>Slidify</span>
      </div>
      <div class="mb-5">
        Slidify is a web application that converts videos into a sequence of 
        slides based on the script or spoken content in the video. Users can 
        upload a video file, and the application will automatically extract 
        the audio, transcribe the spoken content into text, and generate slides 
        summarizing the key points of the script within the user’s Google Drive. 
        This tool is particularly useful for educators, presenters, and content 
        creators who want to create accompanying slide decks for their videos.
      </div>
      <v-btn size="large" class="mb-5 text-none" color="primary" rounded="xl" prepend-icon="mdi-account-circle">
        Sign in with Google
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: "LandingView",
};
</script>

<style>
.material-symbols-outlined {
  font-size: 3.75rem;
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}
</style>