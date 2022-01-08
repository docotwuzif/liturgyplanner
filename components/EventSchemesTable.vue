<template>
  <v-form ref="eventSchemesForm">
    <table style="width: 100%">
      <thead>
        <th>Tag</th>
        <th>Uhrzeit</th>
        <th>Name</th>
      </thead>
      <tbody>
        <tr v-for="(schema, i) in schemes" :key="i">
          <td style="width: 150px">
            <v-select
              v-model="schema.dayShift"
              :items="dayShiftOptions"
              dense
            />
          </td>
          <td style="width: 100px">
            <v-menu>
              <template #activator="{ on, attrs }">
                <v-text-field
                  :value="`${schema.hours
                    .toString()
                    .padStart(2, '0')}:${schema.minutes
                    .toString()
                    .padStart(2, '0')}`"
                  :rules="[(x) => !!parseTime(x) || 'HH:mm']"
                  dense
                  append-icon="mdi-clock"
                  v-bind="attrs"
                  @input="setTime(schema, $event)"
                  @click:append="on.click"
                />
              </template>
              <v-time-picker
                format="24hr"
                scrollable
                :value="`${schema.hours
                  .toString()
                  .padStart(2, '0')}:${schema.minutes
                  .toString()
                  .padStart(2, '0')}`"
                @input="setTime(schema, $event)"
              />
            </v-menu>
          </td>
          <td>
            <v-text-field
              v-model="schema.name"
              :rules="[(x) => x.length > 3 || 'Zu kurz']"
              dense
            />
          </td>
          <td style="vertical-align: baseline">
            <v-icon
              color="red"
              @click="schemes = schemes.filter((x) => x !== schema)"
              >mdi-delete</v-icon
            >
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4" align="right">
            <v-btn text @click="schemes.push({ ...defaultSchema })"
              >Schema hinzufügen</v-btn
            >
          </td>
        </tr>
      </tfoot>
    </table>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { EventSchema } from '@/customTypes'
import { parseTime } from '@/helpers'

@Component
export default class EventSchemesTable extends Vue {
  @Prop({ default: [] })
  value!: EventSchema[]

  private schemes: EventSchema[] = []

  private defaultSchema: EventSchema = {
    dayShift: 0,
    hours: 12,
    minutes: 0,
    name: '',
  }

  private dayShiftOptions = [
    { text: 'Voriger Tag', value: -1 },
    { text: 'Selber Tag', value: 0 },
    { text: 'Nächster Tag', value: 1 },
  ]

  @Watch('value', { immediate: true })
  copyValue(v: EventSchema[]) {
    this.schemes = v
  }

  @Watch('schemes')
  returnValue(v: EventSchema[]) {
    this.$emit('input', v)
  }

  parseTime(timeString: string) {
    return parseTime(timeString)
  }

  setTime(schema: EventSchema, event: string) {
    const res = parseTime(event)
    if (res) {
      const [h, m] = res
      schema.hours = h
      schema.minutes = m
    } else return null
  }

  created() {
    if (this.schemes.length === 0) this.schemes.push(this.defaultSchema)
  }
}
</script>

<style scoped></style>
