<template>
  <v-container>
    <v-row>
      <div v-if="presentationId" class="text-h3 my-4">Generated Slides</div>
    </v-row>
    <v-row class="text-h6 mb-4 align-center">
      <a v-if="presentationId" :href="getPresentationUrl(presentationId)" target="blank">
        <v-icon icon="mdi-link" class="mr-2"></v-icon>
        <span>Link To Slides</span>
      </a>
    </v-row>
    <v-row v-if="presentationId" class="align-center justify-center">
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title>"{{ presentationTitle }}" - Slide {{ currentSlide + 1 }}/{{ slideIds.length }}</v-card-title>
          <v-card-text>
            <v-row class="align-center justify-center">
              <v-btn icon="mdi-chevron-left" density="compact" @click="prevSlide" :disabled="currentSlide <= 0">
              </v-btn>
              <v-col cols="9" md="10" lg="10">
                <iframe ref="currentSlideId" id="slideDisplay" :style="{width: '100%', minHeight: '300px'}" :src="getSlideUrl(presentationId, slideIds[currentSlide])"></iframe>
              </v-col>
              <v-btn icon="mdi-chevron-right" density="compact" @click="nextSlide" :disabled="currentSlide >= this.slideIds.length - 1">
              </v-btn>
              <v-col v-if="slideScripts[slideIds[currentSlide]]" cols="12">
                <h4>Script</h4>
                <span>{{ slideScripts[slideIds[currentSlide]] }}</span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from "vue";

const currentSlideId = ref("");

export default {
  name: "GoogleSlides",
  setup() {
    return {
      currentSlideId
    }
  },
  data: () => ({
    currentSlide: 0
  }),
  props: ["presentationId", "slideIds", "presentationTitle", "slideScripts"],
  watch: {
    slideIds: {
      deep: true,
      handler(){
        this.currentSlide = this.slideIds.length - 1
      }
    }
  },
  methods: {
    getSlideUrl (presentationId, slideId) {
      if (!slideId) {
        this.currentSlide = this.slideIds.length - 1;
      }
      // TODO: Investigate why sometimes the wrong slides are displayed
      return slideId ? `https://docs.google.com/presentation/d/${presentationId}/embed?slide=id.${slideId}&widget=true&rm=minimal` : "";
    },
    getPresentationUrl (presentationId) {
      return `https://docs.google.com/presentation/d/${presentationId}`;
    },
    nextSlide(){
      if (this.currentSlide < this.slideIds.length - 1)
        this.currentSlide++;
    },
    prevSlide(){
      if (this.currentSlide > 0)
        this.currentSlide--;
    }
  }
};
</script>
