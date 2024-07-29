<template>
  <v-btn
    :color="onPrimary"
    rounded="xl"
    size="large"
    :prepend-icon="icon"
    :class="`mx-auto w-100 text-capitalize bg-${color ? color : 'primary'}`"
    @click="onClick"
  >
    <span class="text-body-1">{{ text }}</span>
  </v-btn>
</template>
<script>
export default {
  props: ["text", "icon", "onClick", "color"],
};
</script>
