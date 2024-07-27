<template>
  <v-menu class="notification-list" :activator="activator" v-model="isOpened">
    <v-card class="mx-auto" max-width="450" color="white">
      <v-card-title>Notifications</v-card-title>
      <v-divider></v-divider>
      <v-list v-if="content.length > 0">
        <v-list-item
          class="pa-4"
          v-for="item in content"
          :key="item.text + item.date"
          :to="item.link"
          color="black"
        >
          <v-list-item-title
            :style="{
              lineHeight: 1.3,
              marginBottom: '5px',
              whiteSpace: 'normal',
            }"
          >
            {{ item.text }}
          </v-list-item-title>
          <v-list-item-subtitle>{{
            formatDate(item.date)
          }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <div class="d-flex justify-center pa-4" v-if="content.length > 0">
        <v-btn
          @click="clearNotifications"
          color="primary"
          class="w-100"
          :disabled="content.length == 0"
        >
          Clear Notifications
        </v-btn>
      </div>
      <v-card-subtitle class="py-4" v-if="content.length == 0"
        >You have no notifications</v-card-subtitle
      >
    </v-card>
  </v-menu>
</template>
<script>
export default {
  name: "NotifcationsList",
  data: () => ({
    isOpened: false,
  }),
  props: ["content", "activator", "onClose", "clearNotifications"],
  watch: {
    isOpened: {
      deep: true,
      handler() {
        if (!this.isOpened) {
          this.onClose();
        }
      },
    },
  },
  methods: {
    formatDate(d) {
      const date = new Date(d);
      return date.toDateString().slice(4);
    },
  },
};
</script>

<style scoped>
.notification-list .v-list {
  background: none;
}

.notification-list .v-list * {
  background: none;
}
</style>
