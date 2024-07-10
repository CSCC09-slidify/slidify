<template>
  <v-container>
    <v-row justify="center">
      <v-img :src="image" :height="300"></v-img>
    </v-row>
    <v-row justify="center" class="mb-4">
      <span v-text="loadingMessage"></span>
    </v-row>
    <v-row justify="center">
      <v-progress-circular color="amber" indeterminate></v-progress-circular>
    </v-row>
  </v-container>
</template>
<script>
// https://cloud-c.edupage.org/cloud/1(2).gif?z:PHGlQbKKIhqvgG%2BJvkRQ3%2F9B6KF%2BEiN7dDbBdRp03N7ej%2B%2Blv4yRO0aKe7YxPNbX
import image from "../assets/spinner.gif"

export default {
    props: {
        loadingMessage: {
            type: String
        }
    },
    data: () => ({
        image,
        text: ""
    })
}
</script>