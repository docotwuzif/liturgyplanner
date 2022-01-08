import { Prisma } from '@prisma/client'
import prisma from './prisma'
import { EventSchema } from '~/customTypes'

export async function createBatch(
  occasions: any[],
  eventSchemes: EventSchema[]
) {
  for (const occasion of occasions) {
    const { date, name, createdBy, createdById, updatedBy, updatedById } =
      occasion
    if (
      typeof date !== 'object' &&
      typeof name !== 'string' &&
      typeof createdBy !== 'string' &&
      typeof updatedBy !== 'string' &&
      typeof createdById !== 'number' &&
      typeof updatedById !== 'number'
    ) {
      throw new TypeError('Wrong input.')
    }
    occasion.date = new Date(date)

    const createEvent = (schema: EventSchema) => {
      const eventDate = new Date(
        occasion.date.getFullYear(),
        occasion.date.getMonth(),
        occasion.date.getDate() + schema.dayShift,
        schema.hours,
        schema.minutes
      )
      return {
        date: eventDate,
        name: schema.name,
        createdBy,
        createdById,
        updatedBy,
        updatedById,
      }
    }

    const events: Prisma.EventCreateWithoutOccasionInput[] =
      eventSchemes.map(createEvent)
    await prisma.occasion.create({
      data: { ...occasion, events: { createMany: { data: events } } },
    })
  }
}
