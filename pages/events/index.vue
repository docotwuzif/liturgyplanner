<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-btn @click="mode = mode === 'future' ? 'past' : 'future'"
        >{{ mode === 'future' ? 'Vergangene' : 'Zukünftige' }} Termine</v-btn
      >
      <v-list>
        <v-skeleton-loader v-show="loading" type="list-item@6" />
        <v-list-item v-if="!loading && events.length === 0">
          <v-list-item-title>Keine Termine vorhanden.</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-for="event in events"
          :key="event.id"
          :to="`/events/${event.id}`"
        >
          <v-list-item-content>
            <v-list-item-title v-text="event.name" />
            <v-list-item-subtitle>
              {{ $moment(event.date).format('LLL') }} <br />
              {{ event.occasion.name }}
            </v-list-item-subtitle>
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
    mode: 'future',
    loading: true,
  }),
  async fetch() {
    this.loading = true
    this.events = []
    this.events = await this.$axios.$get(`/api/events/${this.mode}`)
    this.loading = false
  },
  watch: {
    mode() {
      this.$fetch()
    },
  },
}
</script>

<style></style>
