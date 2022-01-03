<template>
  <v-data-table
    :items="scheduleItems"
    :headers="headers"
    :loading="loading"
    :items-per-page="-1"
    disable-sort
    disable-pagination
    disable-filtering
    hide-default-footer
  >
    <template #body="{ items, isMobile }">
      <tbody v-if="!isMobile">
        <tr v-for="item in items" :key="item.id">
          <td
            v-for="field in headers"
            :key="field.value"
            class="d-block d-sm-table-cell"
          >
            {{ item[field.value] }}
          </td>
        </tr>
      </tbody>
      <tbody v-if="isMobile">
        <tr v-for="item in items" :key="item.id">
          <td>
            <p>
              <b>{{ item['position'] }}:</b> {{ item['source'] }}
              {{ item['sourceRef'] }} - {{ item['title'] }}
            </p>
            <p v-if="item['remarks']" style="padding-left: 20px">
              {{ item['remarks'] }}
            </p>
          </td>
        </tr>
      </tbody>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    eventId: {
      type: Number,
      required: true,
    },
    occasionId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    scheduleItems: [],
    loading: true,
    headers: [
      { text: 'Stelle', value: 'position' },
      { text: 'Quelle', value: 'source' },
      { text: 'Referenz', value: 'sourceRef' },
      { text: 'Title', value: 'title' },
      { text: 'Anmerkungen', value: 'remarks' },
    ],
  }),
  async fetch() {
    this.loading = true
    const res = await this.$axios.$get(
      `/api/occasions/${this.occasionId}/schedule`
    )
    this.scheduleItems = res.filter(
      (x) =>
        x.events.length === 0 || x.events.some((y) => y.id === this.eventId)
    )
    this.loading = false
  },
}
</script>

<style></style>
