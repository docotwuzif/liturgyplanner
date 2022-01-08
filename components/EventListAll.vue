<template>
  <v-sheet>
    <v-toolbar>
      <v-toolbar-title>Termine</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn to="/events/create" icon><v-icon>mdi-plus</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
          <v-btn :to="`/events/${mode === 'future' ? 'past' : 'future'}`"
            >{{
              mode === 'future' ? 'Vergangene' : 'Zukünftige'
            }}
            Termine</v-btn
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
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class EventListAll extends Vue {
  private events = []
  private loading = true

  @Prop({ default: 'future' })
  private mode!: 'future' | 'past' | 'all'

  async fetch() {
    this.loading = true
    this.events = []
    this.events = await this.$axios.$get(`/api/events/${this.mode}`)
    this.loading = false
  }
}
</script>

<style scoped></style>
