<template>
  <v-sheet>
    <v-toolbar>
      <v-btn icon @click="$router.back()"
        ><v-icon>mdi-arrow-left</v-icon></v-btn
      >
      <v-menu offset-x
        ><template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on"
            ><v-icon>mdi-clipboard-text</v-icon></v-btn
          ></template
        >
        <ScheduleTemplatePicker @input="addItems" />
      </v-menu>
    </v-toolbar>

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
              <span v-if="field.value === 'actions'">
                <v-menu>
                  <template #activator="{ on, attrs }">
                    <v-btn x-small icon v-bind="attrs" v-on="on"
                      ><v-icon>{{
                        item.events.length > 0
                          ? 'mdi-filter'
                          : 'mdi-filter-outline'
                      }}</v-icon></v-btn
                    >
                  </template>
                  <v-card>
                    <v-card-text>
                      <v-checkbox
                        v-for="event in events"
                        :key="event.id"
                        v-model="item.events"
                        :label="event.name"
                        :value="event.id"
                        dense
                        @change="changeQueued"
                      />
                    </v-card-text>
                  </v-card>
                </v-menu>
                <v-btn x-small icon @click="deleteItem(item)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
                <v-tooltip v-if="item.template" bottom
                  ><template #activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">mdi-information</v-icon>
                  </template>
                  <span>{{ item.template.name }}</span>
                </v-tooltip>
              </span>
            </td>
          </tr>
          <tr slot="footer">
            <td :colspan="headers.length" align="right">
              <v-btn @click="addEmpty">Hinzufügen</v-btn>
            </td>
          </tr>
        </draggable>
        <draggable
          v-if="isMobile"
          v-model="scheduleItems"
          tag="tbody"
          @change="changeQueued"
        >
          <tr v-for="item in scheduleItems" :key="item.id">
            <td>
              <span
                v-for="field in headers"
                :key="field.value"
                class="d-block d-sm-table-cell"
              >
                <v-text-field
                  v-if="field.value !== 'actions'"
                  v-model="item[field.value]"
                  :label="field.text"
                  @change="changeQueued"
                />
                <span v-if="field.value === 'actions'">
                  <v-btn x-small icon @click="deleteItem(item)"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </span>
              </span>
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
  </v-sheet>
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
    events: [],
  }),
  async fetch() {
    this.loading = true
    this.scheduleItems = []
    this.scheduleItems = await this.$axios.$get(
      `/api/occasions/${this.occasionId}/schedule`
    )
    this.events = await this.$axios.$get(
      `/api/occasions/${this.occasionId}/events`
    )
    this.scheduleItems = this.scheduleItems.map((x) => ({
      ...x,
      events: x.events.map((y) => y.id),
    }))
    this.loading = false
  },
  methods: {
    addEmpty() {
      this.scheduleItems.push({
        id: -this.scheduleItems.length - 1,
        source: '',
        sourceRef: '',
        title: '',
        remarks: '',
        type: 'song',
        events: [],
        occasionId: this.occasionId,
        template: null,
      })
    },
    addItems(items) {
      items.forEach((x, i) => {
        x.events = []
        x.occasionId = this.occasionId
        x.id = -this.scheduleItems.length - i - 1
      })
      this.scheduleItems = [...this.scheduleItems, ...items]
      this.changeQueued()
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
      this.$fetch()
    },
  },
}
</script>

<style></style>
