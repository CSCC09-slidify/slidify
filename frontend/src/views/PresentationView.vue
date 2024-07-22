<template>
  <div class="d-flex flex-column mx-auto fill-height">
    <div class="pa-1" v-if="presentation.presentationId">
      <h1>{{ presentation.title }}</h1>
      <div class="text-subtitle-1">Status: {{ presentation.status }}</div>
      <div class="text-subtitle-1">Job started: {{ presentation.jobStarted }}</div>
      <div class="text-subtitle-1">Job completed: {{ presentation.jobFinished }}</div>
    </div>
    <GoogleSlides v-if="presentation.presentationId" :slide-ids="presentation.slideIds"
      :presentation-title="presentation.presentationTitle" :presentation-id="presentation.externalId"
      :slide-scripts="presentation.slideScripts" class="w-100 fill-height" />
    <div v-if="isLoading" :cols="12" :md="presentation.presentationId ? 4 : 12"
      :lg="presentation.presentationId ? 4 : 12">
      <LoadingSpinner loading-message="Fetching presentation" />
    </div>
  </div>
</template>

<script>
import { watch } from "vue";
import { useRoute } from 'vue-router';
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
    watch(() => route.params.presentationId, (newVal) => this.fetchPresentationData(newVal));
    this.fetchPresentationData(route.params.presentationId)
  },
  data: () => ({
    isLoading: false,
    presentation: {
      presentationId: "",
      title: null,
      slideIds: [],
      slideScripts: {},
      externalId: "",
      status: "",
      jobStarted: "",
      jobFinished: ""
    }
  }),
  methods: {
    fetchPresentationData(presentationId) {
      this.isLoading = true;
      this.presentation = {};
      apiService.getSlide(presentationId)
        .then((res) => {
          if (!res.error) {
            this.presentation.presentationId = res.presentationId;
            this.presentation.externalId = res.externalId;
            this.presentation.slideIds = res.slideIds;
            this.presentation.slideScripts = res.slideScripts;
            this.presentation.title = res.title;
            this.presentation.status = res.status;
            const dateOptions = {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            }
            this.presentation.jobStarted = new Date(res.jobStarted).toLocaleString('en-US', dateOptions);
            this.presentation.jobFinished = new Date(res.jobFinished).toLocaleString('en-US', dateOptions);
          }
          this.isLoading = false;
        })
    }
  }
};
</script>