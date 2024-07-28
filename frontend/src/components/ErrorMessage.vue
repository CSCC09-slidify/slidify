<template>
  <v-container>
    <v-row justify="center">
      <v-alert
        icon="$warning"
        color="error"
        :text="message ? message : `There was a problem with your request`"
      >
      </v-alert>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
    },
  },
};
</script>
