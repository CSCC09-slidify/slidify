<template>
  <VideoUpload :on-submit="submitVideo"/>
  <ErrorMessage v-if="error.hasError" :message="error.message"/>
  <GoogleSlides :slide-ids="presentation.slideIds" :presentation-id="presentation.presentationId"/>
  <LoadingSpinner v-if="isLoading" :loading-message="loadingMessage"/>
</template>

<script>
import VideoUpload from "../components/VideoUpload.vue";
import GoogleSlides from "../components/GoogleSlides.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import apiService from "@/services/api.service";
import { io } from "socket.io-client";

export default {
  name: "HomeView",
  components: {
    VideoUpload,
    LoadingSpinner,
    ErrorMessage,
    GoogleSlides,
  },
  data: () => ({
    isLoading: false,
    loadingMessage: "",
    error: {
      hasError: false,
      message: ""
    },
    presentation: {
      presentationId: null,
      slideIds: []
    }
  }),
  methods: {
    submitVideo(video, title) {
      console.log("file uploaded", video.name);
      // TODO: input token
      const token = localStorage.getItem("slidify-slides-token");
      this.isLoading = true;
      this.error.hasError = false;
      this.presentation = {
        presentation: null,
        slideIds: []
      },
      apiService.createSlides(token, title, video)
        .then(job => {
          if (job.id) {
            // TODO: Move URL to .env
            this.websocket = new io("http://localhost:3000")
            this.websocket.on(`slides/${job.id}/done`, (res) => {
              this.isLoading = false;
              if (res.error) {
                this.error = {
                  hasError: true,
                  message: res.error
                }
              }
            })

            this.websocket.on(`slides/${job.id}/status`, (status) => {
              this.loadingMessage = status;
            })

            this.websocket.on(`slides/${job.id}/slideReady`, (slideId) => {
              this.presentation.slideIds.push(slideId);
            })

            this.websocket.on(`slides/${job.id}/presentationId`, (presentationId) => {
              this.presentation.presentationId = presentationId;
            })
          } else {
            this.error = {
              hasError: true,
              message: ""
            }
          }
        })
    }
  }
};
</script>
