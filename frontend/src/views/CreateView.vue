<template>
  <ErrorMessage v-if="error.hasError" :message="error.message" />
  <div v-else-if="!presentation.presentationId" class="px-12 py-8 h-100 d-flex flex-column align-stretch">
    <div class="slides-form w-100">
      <v-radio-group v-model="inputType" hide-details="auto">
        <template v-slot:label>
          <div>Convert from:</div>
        </template>
        <v-radio label="Video or Audio (max 100 MB)" value="video"></v-radio>
        <v-radio label="Text (max 1000 words)" value="text"></v-radio>
      </v-radio-group>
      <VideoUpload v-if="inputType == 'video'" :on-submit="submitVideo" />
      <TextUpload v-if="inputType == 'text'" :on-submit="submitText" />
    </div>
  </div>
  <div v-else class="px-12 py-8 h-100 d-flex flex-column align-stretch">
    <div>
      <h1 class="font-weight-medium">{{ presentation.presentationTitle }}</h1>
      <div class="text-subtitle-1">
        <strong>Status:</strong> {{ presentation.status }}
      </div>
      <div class="text-subtitle-1">
        <strong>Time Elapsed:</strong> {{ presentation.timeElapsed }}
      </div>
    </div>
    <GoogleSlides v-if="presentation.externalId" :slide-ids="presentation.slideIds"
      :presentation-title="presentation.presentationTitle" :presentation-id="presentation.externalId"
      :slide-scripts="presentation.slideScripts" class="w-100 fill-height" />
    <div v-else-if="isLoading" class="align-center justify-center pa-4">
      <div :cols="12" :md="presentation.externalId ? 4 : 12" :lg="presentation.externalId ? 4 : 12">
        <LoadingSpinner :loading-message="loadingMessage" />
      </div>
    </div>
  </div>
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
  name: "CreateView",
  components: {
    VideoUpload,
    TextUpload,
    LoadingSpinner,
    ErrorMessage,
    GoogleSlides,
  },
  emits: ['job-started'],
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
      externalId: "",
      status: "",
      jobStarted: "",
      jobFinished: "",
      timeElapsed: "",
    },
    inputType: "video",
  }),
  created() {
    apiService.getSlideJobs().then((response) => {
      console.log(response);
      if (response.total > 0) {
        const job = response.jobs[0];
        this.presentation.presentationId = job.jid;
        this.presentation.presentationTitle = job.title;
        this.presentation.jobStarted = job.startedAt;
        this.presentation.jobFinished = job.finishedAt;
        if (job.status === "running") {
          this.presentation.status = "Processing inputs...";
        } else if (job.status === "done") {
          this.presentation.status = "Finished processing inputs...";
        }
        this.presentation.timeElapsed = this.getTimeElapsed(job.startedAt, job.finishedAt);
        const updateTimeElapsed = setInterval(() => {
          if (this.presentation.status === "Completed" || this.presentation.finishedAt) {
            clearInterval(updateTimeElapsed);
          } else {
            this.presentation.timeElapsed = this.getTimeElapsed(job.startedAt);
          }
        }, 1000);
        this.isLoading = true;
        this.initSockets(job.jid);
      }
    });
  },
  methods: {
    getTimeElapsed(start, end) {
      if (!end) {
        end = new Date().toISOString()
      }
      const ms = new Date(end) - new Date(start);
      const seconds = Math.floor(ms / 1000);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      let timeElapsed = "";
      if (hours > 0) {
        timeElapsed += `${hours}h `;
      }
      if (minutes > 0) {
        timeElapsed += `${minutes}m `;
      }
      timeElapsed += `${secs}s`;
      return timeElapsed;
    },
    initSockets(jid) {
      websocket.on(`slides/${jid}/done`, (res) => {
        this.isLoading = false;
        if (res.error) {
          this.error = {
            hasError: true,
            message: res.error,
          };
        } else {
          websocket.off(`slides/${jid}/done`);
          websocket.off(`slides/${jid}/status`);
          websocket.off(`slides/${jid}/presentationId`);
        }
      });
      websocket.on(`slides/${jid}/status`, (status) => {
        this.presentation.status = status;
      });
      websocket.on(`slides/${jid}/presentationId`, (presentationId) => {
        this.presentation.externalId = presentationId;
      });
    },
    setupSlideJob(job) {
      if (job.id) {
        this.$emit("job-started", this.presentation.presentationTitle);
        this.initSockets(job.id);
        this.presentation.presentationId = job.id;
        this.presentation.jobStarted = new Date().toISOString();
        const updateTimeElapsed = setInterval(() => {
          if (this.presentation.status === "Completed" || this.presentation.finishedAt) {
            clearInterval(updateTimeElapsed);
          } else {
            this.presentation.timeElapsed = this.getTimeElapsed(this.presentation.jobStarted);
          }
        }, 1000);
        console.log("job started", job.id);
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
