<template>
  <v-container class="ma-0 w-100 fill-height">
    <v-row class="w-100">
      <a v-if="presentationId"
        :href="getPresentationUrl(presentationId)"
        target="blank"
        class="text-decoration-none"
      >
        <span>Open in Google Drive</span>
        <v-icon icon="mdi-open-in-new" class="ma-1"></v-icon>
      </a>
    </v-row>
    <v-row v-if="presentationId" class="w-100 align-center justify-center fill-height">
      <iframe
        id="slideDisplay"
        :src="getIframeUrl(presentationId)"
        frameborder="0" 
        class="w-100 fill-height"
      ></iframe>
    </v-row>
  </v-container>
</template>

<script>
// import { ref } from "vue";

// const currentSlideId = ref("");

export default {
  name: "GoogleSlides",
  // setup() {
  //   return {
  //     currentSlideId
  //   }
  // },
  // data: () => ({
  //   currentSlide: 0
  // }),
  props: ["presentationId", "slideIds", "presentationTitle", "slideScripts"],
  // watch: {
  //   slideIds: {
  //     deep: true,
  //     handler(){
  //       this.currentSlide = this.slideIds.length - 1
  //     }
  //   }
  // },
  methods: {
    // getSlideUrl (presentationId, slideId) {
    //   if (!slideId) {
    //     this.currentSlide = this.slideIds.length - 1;
    //   }
    //   // TODO: Investigate why sometimes the wrong slides are displayed
    //   return slideId ? `https://docs.google.com/presentation/d/${presentationId}/edit` : "";
    // },
    getIframeUrl (presentationId) {
      return `https://docs.google.com/presentation/d/${presentationId}/edit?rm=embedded`;
    },
    getPresentationUrl (presentationId) {
      return `https://docs.google.com/presentation/d/${presentationId}`;
    },
    // nextSlide(){
    //   if (this.currentSlide < this.slideIds.length - 1)
    //     this.currentSlide++;
    // },
    // prevSlide(){
    //   if (this.currentSlide > 0)
    //     this.currentSlide--;
    // }
  }
};
</script>
