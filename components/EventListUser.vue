<template>
  <v-list>
    <v-skeleton-loader v-show="loading" type="list-item@3" />
    <v-list-item
      v-for="assignment in assignments"
      :key="`${assignment.event.id}_${assignment.service.id}`"
      :to="`/events/${assignment.event.id}`"
    >
      <v-list-item-content>
        <v-list-item-title
          >{{ $moment(assignment.event.date).format('LLL') }} -
          {{ assignment.service.name }}</v-list-item-title
        >
        <v-list-item-subtitle>
          {{ assignment.event.name }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  data: () => ({
    assignments: [],
    loading: true,
  }),
  async fetch() {
    this.assignments = await this.$axios.$get(
      `/api/user/${this.$store.state.auth.userData.id})/assignments/future`
    )
    this.loading = false
  },
}
</script>

<style></style>
