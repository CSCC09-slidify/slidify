<template>
  <v-form @submit.prevent="handleSubmit">
    <v-container class="pa-0 ma-0">
      <v-row class="d-flex justify-center align-center pa-0 ma-0">
        <v-col cols="12" md="5" lg="5">
          <v-file-input
            v-model="videoFile"
            label="Upload a video or audio file"
            placeholder="Upload a video or audio file"
            accept=".aac,.amr,.flac,.m4a,.mp3,.mp4,.mpeg,.ogg,.wav"
            hide-details="auto"
            show-size
          ></v-file-input>
        </v-col>
        <v-col cols="12" md="5" lg="5">
          <TextInput
            label="Presentation Title" 
            v-model="title"
          />
        </v-col>
        <v-col cols="12" md="2" lg="2" class="fill-height">
          <v-btn
            @click="handleSubmit"
            type="submit"
            :disabled="!videoFile || !title"
            class="text-capitalize w-100"
            >Generate Slides</v-btn
          >
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
  }),
  components: {
    TextInput,
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
