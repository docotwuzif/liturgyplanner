<template>
  <v-form ref="newOccasionsForm">
    <table style="width: 100%">
      <thead>
        <tr>
          <td>Datum</td>
          <td>Name</td>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(occasion, i) in occasions" :key="i - 1">
          <td style="width: 150px">
            <v-menu>
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-bind="attrs"
                  :value="$moment(occasion.date).format('DD.MM.YYYY')"
                  :rules="[(x) => !!parseDate(x) || 'DD.MM.YYYY']"
                  dense
                  append-icon="mdi-calendar"
                  @click:append="on.click"
                  @change="setOccasionDate(occasion, $event)"
                />
              </template>
              <v-date-picker
                :value="$moment(occasion.date).format('YYYY-MM-DD')"
                @input="
                  $set(occasion, 'date', $moment($event, 'YYYY-MM-DD').toDate())
                "
              />
            </v-menu>
          </td>
          <td>
            <v-text-field
              v-model="occasion.name"
              :rules="[(x) => x.length > 4 || 'Zu kurz']"
              dense
            />
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" align="right">
            <v-btn
              @click="
                $refs.newOccasionsForm.validate()
                occasions.push({ ...defaultValue })
              "
              >Mehr hinzufügen</v-btn
            >
          </td>
        </tr>
      </tfoot>
    </table>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Prisma } from '@prisma/client'

import { parseDate } from '@/helpers'

@Component
export default class OccasionsCreateTable extends Vue {
  @Prop({ default: [] })
  value!: Prisma.OccasionCreateInput[]

  @Prop({ required: true })
  defaultValue!: Prisma.OccasionCreateInput[]

  private occasions: Prisma.OccasionCreateInput[] = []

  @Watch('value', { immediate: true })
  copyValue(v: Prisma.OccasionCreateInput[]) {
    this.occasions = v
  }

  @Watch('occasions')
  returnValue(v: Prisma.OccasionCreateInput[]) {
    this.$emit('input', v)
  }

  setOccasionDate(occasion: Prisma.OccasionCreateInput, e: string) {
    this.$set(occasion, 'date', this.parseDate(e))
  }

  parseDate(dateString: string) {
    return parseDate(dateString)
  }
}
</script>

<style scoped></style>
