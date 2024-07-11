<template>
  <v-form @submit.prevent="handleSubmit">
    <v-container>
      <v-row class="d-flex align-center">
        <v-col cols="12" md="5" lg="6">
          <v-file-input
            v-model="videoFile"
            label="Upload a video"
            placeholder="Upload a video"
            accept="video/*"
            prepend-icon="mdi-video"
            hide-details="auto"
            show-size
          ></v-file-input>
        </v-col>
        <v-col cols="12" md="4" lg="4">
          <TextInput label="Presentation Title" v-model="title"/>
        </v-col>
        <v-col class="flex-grow-0">
          <v-btn @click="handleSubmit" type="submit" :disabled="!videoFile || !title">Generate Slides</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
import TextInput from "./TextInput.vue";

export default {
  data: () => ({
    title: null,
    videoFile: null,
    websocket: null
  }),
  components: {
    TextInput
  },
  props: ["onSubmit"],
  methods: {
    handleSubmit() {
      this.onSubmit(this.videoFile, this.title);
      this.videoFile = null;
      this.title = null;
    },
  },
};
</script>
