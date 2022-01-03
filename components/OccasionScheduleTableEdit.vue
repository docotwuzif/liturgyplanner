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
    <template #body="{ isMobile }">
      <draggable
        v-if="!isMobile"
        v-model="scheduleItems"
        tag="tbody"
        @change="changeQueued"
      >
        <tr v-for="item in scheduleItems" :key="item.id">
          <td
            v-for="field in headers"
            :key="field.value"
            class="d-block d-sm-table-cell"
          >
            <v-text-field
              v-if="field.value !== 'actions'"
              v-model="item[field.value]"
              @change="changeQueued"
            />
            <span v-if="field.value === 'actions'"
              ><v-btn x-small icon @click="deleteItem(item)"
                ><v-icon>mdi-delete</v-icon></v-btn
              ></span
            >
          </td>
        </tr>
        <tr slot="footer">
          <td :colspan="headers.length" align="right">
            <v-btn @click="addEmpty">Hinzufügen</v-btn>
          </td>
        </tr>
      </draggable>
    </template>
    <template #footer>
      <v-card-actions>
        <v-spacer />
        <v-btn icon :disabled="!openChanges" @click="saveChanges"
          ><v-icon>mdi-content-save</v-icon></v-btn
        ></v-card-actions
      >
    </template>
  </v-data-table>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: { draggable },
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
      { text: 'Aktionen', value: 'actions' },
    ],
    openChanges: false,
    toDelete: [],
  }),
  async fetch() {
    this.loading = true
    this.scheduleItems = await this.$axios.$get(
      `/api/occasions/${this.occasionId}/schedule`
    )
    this.loading = false
  },
  methods: {
    addEmpty() {
      this.scheduleItems.push({
        id: -1,
        source: '',
        sourceRef: '',
        title: '',
        remarks: '',
        type: 'song',
        occasionId: this.occasionId,
      })
    },
    deleteItem(item) {
      this.scheduleItems = this.scheduleItems.filter((x) => x.id !== item.id)
      this.toDelete.push(item)
      this.changeQueued()
    },
    changeQueued() {
      this.openChanges = true
    },
    saveChanges() {
      this.toDelete.forEach(async (x) => {
        if (x.id >= 0) await this.$axios.$delete(`/api/schedule/${x.id}`)
      })
      this.scheduleItems.forEach(async (x, i) => {
        x.order = i
        if (x.id < 0) await this.$axios.$post('/api/schedule', x)
        else await this.$axios.$put(`/api/schedule/${x.id}`, x)
      })

      this.openChanges = false
    },
  },
}
</script>

<style></style>
