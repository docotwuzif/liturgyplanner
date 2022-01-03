<template>
  <v-row align="center" justify="center">
    <v-col cols="12" md="6">
      <v-card>
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
      <v-card>
        <v-card-title>Einteilung</v-card-title>
        <v-expansion-panels multiple>
          <v-expansion-panel v-for="group in serviceGroups" :key="group.id">
            <v-expansion-panel-header
              v-text="`${group.name} (${group.assignments.length})`"
            />
            <v-expansion-panel-content>
              <p v-if="group.assignments.length === 0">Keine Einteilung.</p>
              <v-list v-if="group.assignments.length > 0" dense>
                <v-list-item
                  v-for="assignment in group.assignments"
                  :key="`${event.id}_${assignment.service.id}_${assignment.user.id}`"
                >
                  <v-list-item-title v-text="assignment.user.name" />
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
      <v-card>
        <v-card-title>Ablauf</v-card-title>
        <EventScheduleTable :occasion-id="event.occasion.id" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const res1 = await $axios.get(`/api/events/${params.id}`)
    const event = res1.data

    const res2 = await $axios.get(`/api/services`)
    const services = res2.data
    const serviceGroups = Object.fromEntries(
      services.map((x) => [x.id, { id: x.id, name: x.name, assignments: [] }])
    )
    for (const assignment of event.assignments) {
      serviceGroups[assignment.service.id].assignments.push(assignment)
    }

    return { event, serviceGroups }
  },
}
</script>

<style></style>
