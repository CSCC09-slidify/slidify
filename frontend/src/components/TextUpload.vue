<template>
  <v-form @submit.prevent="handleSubmit" class="pt-4 mx-4">
    <v-row class="d-flex align-start">
      <v-col cols="12" md="5" lg="6">
        <v-textarea
          auto-grow
          v-model="text"
          label="Paste Text Here"
          variant="solo"
          placeholder="Enter anything"
          show-size
        ></v-textarea>
      </v-col>
      <v-col cols="12" md="5" lg="6" class="d-flex flex-column justify-space-between">
        <TextInput label="Presentation Title" v-model="title" />
        <v-btn
          class="w-100 mt-5"
          @click="handleSubmit"
          type="submit"
          :disabled="!text || !title"
          >Generate Slides</v-btn
        >
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
import TextInput from "./TextInput.vue";

export default {
  data: () => ({
    title: null,
    text: null,
  }),
  components: {
    TextInput,
  },
  props: ["onSubmit"],
  methods: {
    handleSubmit() {
      this.onSubmit(this.text, this.title);
      this.text = null;
      this.title = null;
    },
  },
};
</script>
