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
    <v-row>
      <v-col v-for="(id, i) in slideIds" :key="i" cols="12" md="6" lg="4">
        <v-card class="pa-4">
          <v-card-title>Slide {{ i + 1 }}</v-card-title>
          <iframe :style="{width: '100%'}" :src="getSlideUrl(presentationId, id)"></iframe>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["presentationId", "slideIds"],
  methods: {
    getSlideUrl (presentationId, slideId) {
      // TODO: Investigate why sometimes the wrong slides are displayed
      return `https://docs.google.com/presentation/d/${presentationId}/embed?slide=id.${slideId}`;
    },
    getPresentationUrl (presentationId) {
      return `https://docs.google.com/presentation/d/${presentationId}`;
    }
  }
};
</script>
