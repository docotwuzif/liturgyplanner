<template>
  <v-row></v-row>
</template>

<script>
export default {
  async beforeCreate() {
    try {
      await this.$axios.post('/api/auth/register', {
        method: 'aad',
        accessToken: this.$route.params.accessToken,
      })
      this.$store.commit(
        'auth/setUserSignedIn',
        (await this.$axios.$get('/api/auth/status')).auth.user
      )
      if (this.$route.query.ref) this.$router.push(this.$route.query.ref)
      else this.$router.push('/')
    } catch {
      this.$router.push('/login')
    }
  },
}
</script>

<style></style>
