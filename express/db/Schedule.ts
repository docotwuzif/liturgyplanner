import { Prisma } from '@prisma/client'
import prisma from './prisma'

export async function getForOccasion(id: any) {
  return await prisma.scheduleElement.findMany({
    where: {
      occasionId: Number.parseInt(id),
    },
    orderBy: {
      order: 'asc',
    },
    select: {
      id: true,
      source: true,
      sourceRef: true,
      position: true,
      title: true,
      remarks: true,
      type: true,
      attachmentUrls: true,
      events: true,
      template: true,
    },
  })
}

export async function create(data: any) {
  const {
    position,
    source,
    sourceRef,
    title,
    remarks,
    order,
    occasionId,
    type,
    createdBy,
    updatedBy,
    createdById,
    updatedById,
    events,
    template,
  } = data

  const scheduleElement: Prisma.ScheduleElementCreateInput = {
    position,
    source,
    sourceRef,
    title,
    remarks,
    order,
    occasion: {
      connect: {
        id: occasionId,
      },
    },
    events: {
      connect: events.map((x: any) => ({ id: Number.parseInt(x) })),
    },
    template: {
      connect: { id: template.id },
    },
    type,
    createdBy,
    updatedBy,
    createdById,
    updatedById,
  }

  return await prisma.scheduleElement.create({
    data: scheduleElement,
  })
}

export async function update(id: any, data: any) {
  const {
    position,
    source,
    sourceRef,
    title,
    remarks,
    order,
    events,
    type,
    updatedBy,
    updatedById,
  } = data

  const scheduleElement: Prisma.ScheduleElementUpdateInput = {
    position,
    source,
    sourceRef,
    title,
    remarks,
    order,
    type,
    updatedBy,
    updatedById,
    events: {
      set: events.map((x: any) => ({ id: Number.parseInt(x) })),
    },
  }

  return await prisma.scheduleElement.update({
    where: {
      id: Number.parseInt(id),
    },
    data: scheduleElement,
  })
}

export async function del(id: any) {
  return await prisma.scheduleElement.delete({
    where: {
      id: Number.parseInt(id),
    },
  })
}

export async function getTemplates() {
  return await prisma.scheduleTemplate.findMany()
}
