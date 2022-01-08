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
    updatedBy,
    updatedById,
  } = data
  return await prisma.scheduleElement.update({
    where: {
      id: Number.parseInt(id),
    },
    data: {
      position,
      source,
      sourceRef,
      title,
      remarks,
      order,
      updatedBy,
      updatedById,
    },
  })
}

export async function del(id: any) {
  return await prisma.scheduleElement.delete({
    where: {
      id: Number.parseInt(id),
    },
  })
}
