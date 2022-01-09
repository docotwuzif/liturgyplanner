<template>
  <v-sheet>
    <v-toolbar
      ><v-btn icon class="hidden-xs-only" @click="$router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Terminansicht</v-toolbar-title>

      <v-icon @click="downloadPdf">mdi-file</v-icon>
    </v-toolbar>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6">
        <v-card class="my-2">
          <v-card-title v-text="event.name" />
          <v-card-subtitle v-text="event.occasion.name" />
          <v-list>
            <v-list-item>
              <v-list-item-title>Wann?</v-list-item-title
              ><v-list-item-subtitle>{{
                $moment(event.date).format('LLL')
              }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
        <v-card class="my-2">
          <v-card-title>Einteilung</v-card-title>
          <AssignmentPanels
            :service-groups="serviceGroups"
            :event-id="event.id"
            @assignmentAdded="updateAssignments"
            @assignmentDeleted="updateAssignments"
          />
        </v-card>
        <v-card class="my-2">
          <v-card-title
            >Ablauf <v-spacer /><v-card-actions
              ><v-btn icon :to="`/occasions/${event.occasion.id}`"
                ><v-icon>mdi-pencil</v-icon></v-btn
              ></v-card-actions
            ></v-card-title
          >

          <EventScheduleTable
            :occasion-id="event.occasion.id"
            :event-id="event.id"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const res1 = await $axios.get(`/api/events/${params.id}`)
    const event = res1.data

    const res2 = await $axios.get(`/api/services`)
    const services = res2.data
    const serviceGroups = Object.fromEntries(
      services.map((x) => [
        x.id,
        {
          id: x.id,
          name: x.name,
          assignments: [],
          count: 0,
          event: { id: params.id },
        },
      ])
    )
    for (const assignment of event.assignments) {
      serviceGroups[assignment.service.id].assignments.push(assignment)
      serviceGroups[assignment.service.id].count++
    }

    return { event, serviceGroups }
  },
  methods: {
    async updateAssignments() {
      await this.$nuxt.refresh()
    },
    downloadPdf() {
      window.location.href = `/api/events/${this.event.id}/pdf`
    },
  },
}
</script>

<style></style>
