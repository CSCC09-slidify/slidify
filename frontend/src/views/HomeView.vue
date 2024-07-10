<template>
  <VideoUpload :on-submit="submitVideo"/>
  <ErrorMessage v-if="error.hasError" :message="error.message"/>
  <v-row class="align-center justify-center pa-4">
    <v-col cols="12" md="8" lg="8" v-if="presentation.presentationId">
      <GoogleSlides :slide-ids="presentation.slideIds" 
                    :presentation-title="presentation.presentationTitle" 
                    :presentation-id="presentation.presentationId"
                    :slide-scripts="presentation.slideScripts"
      />
    </v-col>
    <v-col  v-if="isLoading" :cols="12" :md="presentation.presentationId ? 4 : 12" :lg="presentation.presentationId ? 4 : 12">
      <LoadingSpinner :loading-message="loadingMessage"/>
    </v-col>
  </v-row>
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
      presentationId: "",
      presentationTitle: null,
      slideIds: [],
      slideScripts: {}
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
        presentationTitle: "",
        slideIds: [],
        slideScripts: {}
      },
      apiService.createSlides(token, title, video)
        .then(job => {
          this.presentation.presentationTitle = title;
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
              console.log(this.presentation.slideScripts)
            })

            this.websocket.on(`slides/${job.id}/status`, (status) => {
              this.loadingMessage = status;
            })

            this.websocket.on(`slides/${job.id}/slideReady`, (slideId) => {
              this.presentation.slideIds.push(slideId);
            })

            this.websocket.on(`slides/${job.id}/scriptReady`, ({slideId, script}) => {
              this.presentation.slideScripts[slideId] = script;
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
