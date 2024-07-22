<template>
  <VideoUpload :on-submit="submitVideo" />
  <ErrorMessage v-if="error.hasError" :message="error.message" />
  <GoogleSlides v-if="presentation.presentationId" :slide-ids="presentation.slideIds"
    :presentation-title="presentation.presentationTitle" :presentation-id="presentation.presentationId"
    :slide-scripts="presentation.slideScripts" class="w-100 fill-height" />
  <v-row class="align-center justify-center pa-4">
    <v-col v-if="isLoading" :cols="12" :md="presentation.presentationId ? 4 : 12"
      :lg="presentation.presentationId ? 4 : 12">
      <LoadingSpinner :loading-message="loadingMessage" />
    </v-col>
  </v-row>
</template>

<script>
import VideoUpload from "../components/VideoUpload.vue";
import GoogleSlides from "../components/GoogleSlides.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import apiService from "@/services/api.service";
import { websocket } from "@/services/socket.service";

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
      slideScripts: {},
      externalId: "",
      status: "",
      jobStarted: "",
      jobFinished: ""
    }
  }),
  methods: {
    submitVideo(video, title) {
      console.log("file uploaded", video.name);
      // TODO: input token
      this.isLoading = true;
      this.error.hasError = false;
      this.presentation = {
        presentation: null,
        presentationTitle: "",
        slideIds: [],
        slideScripts: {}
      },
      apiService.createSlides(title, video)
        .then(job => {
          this.presentation.presentationTitle = title;
          if (job.id) {
            // TODO: Move URL to .env
            websocket.on(`slides/${job.id}/done`, (res) => {
              this.isLoading = false;
              if (res.error) {
                this.error = {
                  hasError: true,
                  message: res.error
                }
              }
              console.log(this.presentation.slideScripts)
            })

            // websocket.on(`slides/${job.id}/status`, (status) => {
            //   this.loadingMessage = status;
            // })

            // websocket.on(`slides/${job.id}/slideReady`, (slideId) => {
            //   this.presentation.slideIds.push(slideId);
            // })

            // websocket.on(`slides/${job.id}/scriptReady`, ({slideId, script}) => {
            //   this.presentation.slideScripts[slideId] = script;
            // })

            websocket.on(`slides/${job.id}/presentationId`, (presentationId) => {
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
