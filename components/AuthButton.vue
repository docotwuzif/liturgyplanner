<template>
  <v-btn v-if="!signedIn" :to="signedIn ? '/logout' : '/login'">{{
    signedIn ? 'Logout' : 'Login'
  }}</v-btn>
</template>

<script>
export default {
  computed: {
    signedIn() {
      return this.$store.state.auth.signedIn
    },
  },
}
</script>

<style></style>
