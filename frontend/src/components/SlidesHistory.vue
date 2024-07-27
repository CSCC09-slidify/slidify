<template>
  <div class="slidesHistory">
    <v-list-item class="pa-4" title="History"></v-list-item>
    <v-divider></v-divider>
    <v-virtual-scroll :items="slidesHistory">
      <template v-slot:default="{ item }">
        <v-list-item
          class="pa-4"
          :key="item.presentationId"
          :title="item.title"
          :subtitle="formatDate(item.createdAt)"
          :to="`/presentations/${item.presentationId}`"
          color="black"
          active-class="isCurrentPresentation"
        >
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script>
export default {
  name: "SlidesHistoryBarView",
  props: ["slidesHistory"],
  methods: {
    formatDate(d) {
      const date = new Date(d);
      return date.toDateString().slice(4);
    },
  },
};
</script>

<style scoped>
.slidesHistory a {
  text-decoration: none;
  color: black;
}
.isCurrentPresentation {
  background-color: rgb(var(--v-theme-surfaceActive)) !important;
}

.isCurrentPresentation > :first-child {
  background-color: white !important;
}
</style>
