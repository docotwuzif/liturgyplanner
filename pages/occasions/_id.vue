<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="9">
      <OccasionScheduleTableEdit :occasion-id="id" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  computed: {
    id() {
      return Number(this.$route.params.id)
    },
  },
}
</script>

<style></style>
