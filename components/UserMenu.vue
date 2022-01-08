<template>
  <v-menu v-if="$store.state.auth.signedIn" offset-y>
    <template #activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">{{
        $store.state.auth.userData.name
      }}</v-btn>
    </template>
    <v-list>
      <v-list-item>
        <v-list-item-subtitle v-text="$store.state.auth.userData.email" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {}
</script>

<style></style>
