<template>
  <v-row>
    <v-col cols="12" md="6">
      <a href="/auth/login/aad">Login with Microsoft</a>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'LoginPage',
  middleware({ redirect, route }) {
    return redirect('/auth/login/aad?ref=' + (route.query.ref || '/'))
  },
}
</script>

<style></style>
