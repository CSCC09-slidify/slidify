<template>
  <div class="d-flex flex-column mx-auto fill-height">
    <div class="pa-1">
      <h1>{{ presentation.title }}</h1>
      <div class="text-subtitle-1">Status: in progress</div>
      <div class="text-subtitle-1">Job started: July 21 2024 @ 6:20pm</div>
      <div class="text-subtitle-1">Job completed: July 21 2024 @ 7:20pm</div>
    </div>
      <GoogleSlides v-if="presentation.presentationId"
                    :slide-ids="presentation.slideIds" 
                    :presentation-title="presentation.presentationTitle" 
                    :presentation-id="presentation.externalId"
                    :slide-scripts="presentation.slideScripts"
                    class="w-100 fill-height"
      />
    <div v-if="isLoading" :cols="12" :md="presentation.presentationId ? 4 : 12" :lg="presentation.presentationId ? 4 : 12">
      <LoadingSpinner loading-message="Fetching presentation"/>
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
    watch(() => route.params.presentationId, (newVal) =>  this.fetchPresentationData(newVal));
    this.fetchPresentationData(route.params.presentationId)
  },
  data: () => ({
    isLoading: false,
    presentation: {
      presentationId: "",
      title: null,
      slideIds: [],
      slideScripts: {},
      externalId: ""
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
                }
                this.isLoading = false;
            })
    }
  }
};
</script>