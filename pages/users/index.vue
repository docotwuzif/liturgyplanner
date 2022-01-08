<template>
  <v-sheet>
    <v-toolbar>
      <v-toolbar-title>Benutzerverwaltung</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn to="/users/import/aad" icon><v-icon>mdi-import</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class UserPage extends Vue {}
</script>

<style scoped></style>
