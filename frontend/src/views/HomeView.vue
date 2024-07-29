<template>
  <v-container>
    <v-row class="pt-2">
      <div class="pt-2">Convert from</div>
      <v-radio-group inline v-model="inputType" hide-details="auto">
        <v-radio label="Video or Audio" value="video"></v-radio>
        <v-radio label="Text" value="text"></v-radio>
      </v-radio-group>
      <v-btn variant="text" to="/settings" rounded="xl">Adjust Slide settings</v-btn>
    </v-row>
    <VideoUpload v-if="inputType == 'video'" :on-submit="submitVideo" />
    <TextUpload v-if="inputType == 'text'" :on-submit="submitText" />
    <ErrorMessage v-if="error.hasError" :message="error.message" />
    <GoogleSlides
      v-if="presentation.presentationId"
      :slide-ids="presentation.slideIds"
      :presentation-title="presentation.presentationTitle"
      :presentation-id="presentation.presentationId"
      :slide-scripts="presentation.slideScripts"
      class="w-100 fill-height"
    />
    <v-row class="align-center justify-center pa-4">
      <v-col
        v-if="isLoading"
        :cols="12"
        :md="presentation.presentationId ? 4 : 12"
        :lg="presentation.presentationId ? 4 : 12"
      >
        <LoadingSpinner :loading-message="loadingMessage" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoUpload from "../components/VideoUpload.vue";
import TextUpload from "../components/TextUpload.vue";
import GoogleSlides from "../components/GoogleSlides.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import apiService from "@/services/api.service";
import { websocket } from "@/services/socket.service";

export default {
  name: "HomeView",
  components: {
    VideoUpload,
    TextUpload,
    LoadingSpinner,
    ErrorMessage,
    GoogleSlides,
  },
  data: () => ({
    isLoading: false,
    loadingMessage: "",
    error: {
      hasError: false,
      message: "",
    },
    presentation: {
      presentationId: "",
      presentationTitle: null,
      slideIds: [],
      slideScripts: {},
      externalId: "",
      status: "",
      jobStarted: "",
      jobFinished: "",
    },
    inputType: "video",
  }),
  methods: {
    setupSlideJob(job) {
      if (job.id) {
        // TODO: Move URL to .env
        websocket.on(`slides/${job.id}/done`, (res) => {
          this.isLoading = false;
          if (res.error) {
            this.error = {
              hasError: true,
              message: res.error,
            };
          }
          console.log(this.presentation.slideScripts);
        });

        websocket.on(`slides/${job.id}/status`, (status) => {
          this.loadingMessage = status;
        });

        websocket.on(`slides/${job.id}/slideReady`, (slideId) => {
          this.presentation.slideIds.push(slideId);
        });

        websocket.on(`slides/${job.id}/scriptReady`, ({ slideId, script }) => {
          this.presentation.slideScripts[slideId] = script;
        });

        websocket.on(`slides/${job.id}/presentationId`, (presentationId) => {
          this.presentation.presentationId = presentationId;
        });
      } else {
        this.error = {
          hasError: true,
          message: job ? job.error : "",
        };
      }
    },
    submitVideo(video, title) {
      console.log("file uploaded", video.name);
      // TODO: input token
      this.isLoading = true;
      this.error.hasError = false;
      (this.presentation = {
        presentation: null,
        presentationTitle: "",
        slideIds: [],
        slideScripts: {},
      }),
        apiService.createSlidesFromVideo(title, video).then((job) => {
          this.presentation.presentationTitle = title;
          this.setupSlideJob(job);
        });
    },
    submitText(text, title) {
      console.log("text uploaded", title);
      if (text.split(" ").length < 200) {
        this.error = {
          hasError: true,
          message: "Text must be at least 200 words long",
        };
        return;
      } else if (text.split(" ").length > 1000) {
        this.error = {
          hasError: true,
          message: "Text must be less than 1000 words long",
        };
        return;
      }
      this.isLoading = true;
      this.error.hasError = false;
      (this.presentation = {
        presentation: null,
        presentationTitle: "",
        slideIds: [],
        slideScripts: {},
      }),
        apiService.createSlidesFromText(title, text).then((job) => {
          this.presentation.presentationTitle = title;
          this.setupSlideJob(job);
        });
    },
  },
};
</script>
