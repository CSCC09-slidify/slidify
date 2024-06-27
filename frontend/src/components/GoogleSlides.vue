<template>
  <v-container>
    <v-row>
      <v-col v-for="i in 5" :key="i" cols="12" md="6" lg="4">
        <v-card class="pa-16">
          <v-card-title>Slide {{ i }}</v-card-title>
          <v-card-text> This is a blank slide. </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>
