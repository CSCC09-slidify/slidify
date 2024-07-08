<template>
  <v-form @submit.prevent="handleSubmit">
    <v-container>
      <v-row class="d-flex align-center">
        <v-col class="flex-grow-1">
          <v-file-input
            v-model="videoFile"
            label="Upload a video"
            placeholder="Upload a video"
            accept="video/*"
            prepend-icon="mdi-video"
            hide-details="auto"
            show-size
          ></v-file-input>
        </v-col>
        <v-col class="flex-grow-0">
          <v-btn type="submit" :disabled="!videoFile">Generate Slides</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
import apiService from "@/services/api.service";

export default {
  data: () => ({
    videoFile: null,
  }),
  methods: {
    handleSubmit() {
      console.log("file uploaded", this.videoFile.name);
      // TODO: input token and presentation title
      apiService.createSlides("Test slides", this.videoFile)
        .then(res => {
          console.log(res);
        })
      this.videoFile = null;
    },
  },
};
</script>
