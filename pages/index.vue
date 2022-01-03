<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="py-4 d-flex justify-center">
        <h1>Herzlich willkommen!</h1>
      </v-card>
      <v-card>
        <v-card-title class="headline"> Meine nächsten Termine </v-card-title>
        <v-card-text>
          <EventListUser />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
}
</script>
