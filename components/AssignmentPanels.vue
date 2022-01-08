<template>
  <v-dialog v-model="addingDialog" max-width="400">
    <template #activator="{ attrs, on }">
      <v-expansion-panels multiple v-bind="attrs" v-on="on">
        <v-expansion-panel v-for="group in serviceGroups" :key="group.id">
          <v-expansion-panel-header
            >{{ group.name }} ({{ group.count }})<template #actions
              ><v-icon color="green" @click="showAddingDialog(group)"
                >mdi-plus</v-icon
              >
              <v-icon color="primary"> $expand </v-icon>
            </template></v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <p v-if="group.assignments.length === 0">Keine Einteilung.</p>
            <v-list v-if="group.assignments.length > 0" dense>
              <v-list-item
                v-for="assignment in group.assignments"
                :key="`${group.event.id}_${assignment.service.id}_${assignment.user.id}`"
              >
                <v-list-item-action>
                  <v-icon
                    @click="
                      deleteAssignment({
                        eventId,
                        userId: assignment.user.id,
                        serviceId: assignment.service.id,
                      })
                    "
                    >mdi-minus</v-icon
                  >
                </v-list-item-action>
                <v-list-item-title v-text="assignment.user.name" />
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
    <v-card v-if="addingDialogService">
      <v-card-title>{{ addingDialogService.name }} hinzufügen</v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="userToAdd"
          :items="eligibleUsers(addingDialogService.id)"
          item-text="name"
          item-value="id"
          label="Benutzer"
        />
        <v-text-field v-model="addUserComment" label="Kommentar" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="addUser(addingDialogService.id)">Hinzufügen</v-btn>
        <v-alert type="error" v-if="error" v-html="error" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    eventId: {
      type: Number,
      required: true,
    },
    serviceGroups: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    addingDialog: false,
    addingDialogService: null,
    users: [],
    userToAdd: null,
    addUserComment: '',
    error: null,
  }),
  async fetch() {
    this.users = await this.$axios.$get('/api/users')
  },
  methods: {
    showAddingDialog(service) {
      this.addingDialogService = service
      this.addingDialog = true
      this.error = null
    },
    eligibleUsers(serviceId) {
      return this.users.filter(
        (user) =>
          user.qualifiedFor.some((q) => q.id === serviceId) &&
          this.serviceGroups[serviceId].assignments.every(
            (a) => a.user.id !== user.id
          )
      )
    },
    async addUser(serviceId) {
      try {
        const assignment = await this.$axios.$post('/api/assignments', {
          userId: this.userToAdd,
          serviceId,
          eventId: this.eventId,
          comment: this.addUserComment,
        })
        this.addingDialog = false
        this.addingDialogService = null
        this.userToAdd = null
        this.$emit('assignmentAdded', assignment)
      } catch (err) {
        this.error = err
      }
    },
    async deleteAssignment(assignment) {
      await this.$axios.$delete('/api/assignments', { data: assignment })
      this.$emit('assignmentDeleted', assignment)
    },
  },
}
</script>

<style></style>
