<template>
  <v-row align="center" justify="center">
    <v-col cols="12" md="9" lg="8">
      <v-card class="my-2">
        <v-card-title>Neue Anlässe erstellen</v-card-title>
        <v-card-text>
          <OccasionsCreateTable
            v-model="occasions"
            :default-value="defaultOccasion"
          />
        </v-card-text>
      </v-card>
      <v-card class="my-2">
        <v-card-title>Ereignisschema festlegen</v-card-title>
        <v-card-text><EventSchemesTable v-model="eventSchemes" /></v-card-text>
      </v-card>
      <v-card class="my-2">
        <v-card-actions
          ><v-spacer /><v-btn @click="send">Ereignisse erstellen</v-btn
          ><v-spacer
        /></v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Prisma } from '@prisma/client'
import { EventSchema } from '@/customTypes'

const defaultOccasion: () => Prisma.OccasionCreateInput = () => ({
  date: new Date(),
  name: '',
  createdBy: '',
  createdById: -1,
  updatedBy: '',
  updatedById: -1,
})

@Component
export default class CreateEventsView extends Vue {
  private occasions: Prisma.OccasionCreateInput[] = [defaultOccasion()]
  private defaultOccasion: Prisma.OccasionCreateInput = defaultOccasion()

  private eventSchemes: EventSchema[] = []

  async send() {
    await this.$axios.$post('/api/occasions', {
      occasions: this.occasions,
      eventSchemes: this.eventSchemes,
    })
  }
}
</script>

<style scoped></style>
