<template>
  <v-row></v-row>
</template>

<script>
export default {
  async beforeCreate() {
    try {
      await this.$axios.post('http://localhost:8080/api/auth/register', {
        method: 'aad',
        accessToken: this.$route.params.accessToken,
      })
      this.$store.commit(
        'auth/setUserSignedIn',
        (await this.$axios.$get('/api/auth/status')).auth.user
      )
      this.$router.push('/')
    } catch {
      this.$router.push('/login')
    }
  },
}
</script>

<style></style>
