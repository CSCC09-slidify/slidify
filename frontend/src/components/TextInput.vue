<template>
  <v-text-field 
    :label="label" 
    prepend-icon="mdi-file-presentation-box"
    hide-details="auto"
    clearable
  ></v-text-field>
</template>
<script>
export default {
    props: {
        label: {
            type: String
        }
    }
}
</script>