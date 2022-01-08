import prisma from './prisma'

export async function create(data: any) {
  const {
    userId,
    eventId,
    serviceId,
    comment,
    createdBy,
    createdById,
    updatedBy,
    updatedById,
  } = data
  if (
    typeof userId !== 'number' ||
    typeof eventId !== 'number' ||
    typeof serviceId !== 'number' ||
    typeof serviceId !== 'string'
  ) {
    throw new TypeError('Wrong input format.')
  }
  return await prisma.assignment.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      event: {
        connect: {
          id: eventId,
        },
      },
      service: {
        connect: {
          id: serviceId,
        },
      },
      comment,
      createdBy,
      createdById,
      updatedBy,
      updatedById,
    },
  })
}

export async function deleteEl(data: {
  userId: any
  eventId: any
  serviceId: any
}) {
  const { userId, eventId, serviceId } = data
  if (
    typeof userId !== 'number' ||
    typeof eventId !== 'number' ||
    typeof serviceId !== 'number'
  ) {
    throw new TypeError('Wrong input format.')
  }
  return await prisma.assignment.delete({
    where: {
      serviceId_eventId_userId: {
        userId,
        eventId,
        serviceId,
      },
    },
  })
}
