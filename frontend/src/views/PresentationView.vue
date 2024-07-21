<template>
  <div class="d-flex mx-auto fill-height">
    <v-col v-if="presentation.presentationId" class="w-100 fill-height">
      <GoogleSlides :slide-ids="presentation.slideIds" 
                    :presentation-title="presentation.presentationTitle" 
                    :presentation-id="presentation.externalId"
                    :slide-scripts="presentation.slideScripts"
      />
    </v-col>
    <v-col v-if="isLoading" :cols="12" :md="presentation.presentationId ? 4 : 12" :lg="presentation.presentationId ? 4 : 12">
      <LoadingSpinner loading-message="Fetching presentation"/>
    </v-col>
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
                    this.presentation.presentationTitle = res.title;
                }
                this.isLoading = false;
            })
    }
  }
};
</script>