<template>
  <EventListAll :mode="mode" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class EventListView extends Vue {
  private mode = 'future'
}
</script>

<style></style>
