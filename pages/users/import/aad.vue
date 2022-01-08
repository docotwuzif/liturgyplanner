<template>
  <v-row>
    <v-col cols="4">
      <v-list>
        <v-subheader>Verfügbare User</v-subheader>
        <v-list-item
          v-for="user in AADusers.filter((x) => !x.selected)"
          :key="user.id"
        >
          <v-list-item-content>
            <v-list-item-title v-text="user.displayName" />
            <v-list-item-subtitle v-text="user.mail" />
          </v-list-item-content>
          <v-list-item-action>
            <v-icon @click="$set(user, 'selected', true)"
              >mdi-arrow-right</v-icon
            >
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="4">
      <v-list>
        <v-subheader>Warten auf Import</v-subheader>
        <v-list-item
          v-for="user in AADusers.filter((x) => x.selected)"
          :key="user.uid"
        >
          <v-list-item-action>
            <v-icon @click="$set(user, 'selected', false)"
              >mdi-arrow-left</v-icon
            >
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="user.displayName" />
            <v-list-item-subtitle v-text="user.mail" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-checkbox
        v-for="service in services"
        :key="service.id"
        v-model="servicesSelected"
        :label="service.name"
        :value="service.id"
        hide-details
      />
      <v-btn :disabled="AADusers.every((x) => !x.selected)" @click="importUsers"
        >Import starten</v-btn
      >
      <v-snackbar v-model="successMsg" color="success" :timeout="700"
        >Benutzer erfolgreich hinzugefügt.</v-snackbar
      >
      <v-snackbar v-model="errorMsg" color="error" :timeout="700"
        >Ein Fehler ist aufgetreten</v-snackbar
      >
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'UsersImportAADView',
  async asyncData({ $axios }) {
    const existingUsers = await $axios.$get('/api/users')
    const AADusers = (await $axios.$get('/api/users/AAD')).filter(
      (user) => !existingUsers.some((x) => x.uid === user.id)
    )
    const services = await $axios.$get('/api/services')
    return { AADusers, services }
  },
  data: () => ({
    servicesSelected: [],
    successMsg: false,
    errorMsg: true,
  }),
  methods: {
    async importUsers() {
      const promises = []
      this.AADusers.filter((x) => x.selected).forEach((x) => {
        promises.push(
          this.$axios.$post('/api/users', {
            uid: x.id,
            authProvider: 'AAD',
            qualifiedFor: this.servicesSelected,
          })
        )
      })
      try {
        await Promise.all(promises)
        this.successMsg = true
      } catch {
        this.errorMsg = true
        return
      }
      this.AADusers = this.AADusers.filter((x) => !x.selected)
      this.servicesSelected = []
    },
  },
}
</script>

<style></style>
