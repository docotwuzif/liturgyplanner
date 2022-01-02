<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-list
        ><v-list-item v-for="event in events" :key="event.id">
          <v-list-item-content>
            <v-list-item-title v-text="event.name" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'EventsPage',
  data: () => ({
    events: [],
  }),
  async fetch() {
    this.events = await this.$axios.$get('/api/events')
  },
}
</script>

<style></style>
