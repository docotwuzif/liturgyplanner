<template>
  <v-card>
    <!-- <v-card-text> -->
    <v-list dense>
      <v-list-item
        v-for="(template, i) in templates"
        :key="i"
        @click="emitScheduleElements(template)"
      >
        <v-list-item-title v-text="template.name" />
      </v-list-item>
      <v-skeleton-loader v-show="loading" type="list-item{3}" />
    </v-list>
    <!-- </v-card-text> -->
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ScheduleTemplate } from '@prisma/client'

type TemplatePiece = {
  position: string
  source?: string
  sourceRef?: string
  title?: string
  remarks?: string
  type?: string
}

type _ScheduleElement = {
  type: string
  source: string
  sourceRef: string
  title: string
  position: string
  remarks: string
  attachmentUrls: string[]
  template: { id: number; name?: string } | null
}

@Component
export default class ScheduleTemplatePicker extends Vue {
  private templates: ScheduleTemplate[] = []

  private loading: boolean = true

  async fetch() {
    this.loading = true
    this.templates = await this.$axios.$get('/api/schedule/templates')
    this.loading = false
  }

  emitScheduleElements(template: {
    data: TemplatePiece[]
    id: number
    name: string
  }) {
    const elements: _ScheduleElement[] = []

    for (const x of template.data) {
      const element: _ScheduleElement = {
        type: x.type || 'song',
        source: x.source || '',
        sourceRef: x.sourceRef || '',
        title: x.title || '',
        position: x.position,
        remarks: x.remarks || '',
        attachmentUrls: [],
        template: { id: template.id, name: template.name },
      }
      elements.push(element)
    }
    this.$emit('input', elements)
  }
}
</script>

<style scoped></style>
