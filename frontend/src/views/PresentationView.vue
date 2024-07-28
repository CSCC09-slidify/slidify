<template>
  <div class="px-8 h-100 d-flex flex-column align-stretch">
    <div v-if="presentation.presentationId">
      <h1 class="font-weight-medium" >{{ presentation.presentationTitle }}</h1>
      <div class="text-subtitle-1">
        <strong>Status:</strong> {{ presentation.status }}
      </div>
      <div class="text-subtitle-1">
        <strong>Time Elapsed:</strong> {{ presentation.timeElapsed }}
      </div>
    </div>
    <GoogleSlides
      v-if="presentation.presentationId"
      :slide-ids="presentation.slideIds"
      :presentation-title="presentation.presentationTitle"
      :presentation-id="presentation.externalId"
      :slide-scripts="presentation.slideScripts"
      class="pb-4"
    />
    <div
      v-if="isLoading"
      :cols="12"
      :md="presentation.presentationId ? 4 : 12"
      :lg="presentation.presentationId ? 4 : 12"
    >
      <LoadingSpinner loading-message="Fetching presentation" />
    </div>
  </div>
</template>

<script>
import { watch } from "vue";
import { useRoute } from "vue-router";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import GoogleSlides from "../components/GoogleSlides.vue";
import apiService from "@/services/api.service";

export default {
  name: "PresentationView",
  components: {
    LoadingSpinner,
    GoogleSlides,
  },
  created() {
    const route = useRoute();
    watch(
      () => route.params.presentationId,
      (newVal) => this.fetchPresentationData(newVal),
    );
    this.fetchPresentationData(route.params.presentationId);
  },
  data: () => ({
    isLoading: false,
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
  }),
  methods: {
    getTimeElapsed(jobStarted, jobFinished) {
      const ms = new Date(jobFinished) - new Date(jobStarted);
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
    fetchPresentationData(presentationId) {
      this.isLoading = true;
      this.presentation = {};
      apiService.getSlide(presentationId).then((res) => {
        if (!res.error) {
          this.presentation.presentationId = res.presentationId;
          this.presentation.externalId = res.externalId;
          this.presentation.slideIds = res.slideIds;
          this.presentation.slideScripts = res.slideScripts;
          this.presentation.presentationTitle = res.title;
          this.presentation.status = res.status ===  "done" ? "Completed" : "In progress";
          this.presentation.timeElapsed = this.getTimeElapsed(res.jobStarted, res.jobFinished);
        }
        this.isLoading = false;
      });
    },
  },
};
</script>
