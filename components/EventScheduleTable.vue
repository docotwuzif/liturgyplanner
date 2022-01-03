<template>
  <v-data-table :items="scheduleItems" :headers="headers" :loading="loading">
  </v-data-table>
</template>

<script>
export default {
  props: {
    occasionId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    scheduleItems: [],
    loading: true,
    headers: [
      { text: 'Stelle', value: 'position' },
      { text: 'Quelle', value: 'source' },
      { text: 'Referenz', value: 'sourceRef' },
      { text: 'Title', value: 'title' },
      { text: 'Anmerkungen', value: 'remarks' },
    ],
  }),
  async fetch() {
    this.loading = true
    this.scheduleItems = await this.$axios.$get(
      `/api/occasions/${this.occasionId}/schedule`
    )
    this.loading = false
  },
}
</script>

<style></style>
