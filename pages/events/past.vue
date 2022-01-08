<template>
  <EventListAll :mode="mode" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class EventListView extends Vue {
  private mode = 'past'
}
</script>

<style></style>
