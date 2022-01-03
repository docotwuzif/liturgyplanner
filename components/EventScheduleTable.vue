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
    <template #item="{ item, isMobile }">
      <tr v-if="!isMobile">
        <td
          v-for="field in headers"
          :key="field.value"
          class="d-block d-sm-table-cell"
        >
          {{ item[field.value] }}
        </td>
      </tr>
      <tr v-if="isMobile">
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
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
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
    this.scheduleItems = await this.$axios.$get(
      `/api/occasions/${this.occasionId}/schedule`
    )
    this.loading = false
  },
}
</script>

<style></style>
