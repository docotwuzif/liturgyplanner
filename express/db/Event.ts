import prisma from './prisma'

export async function getAll(timeFrame: 'future' | 'past' | 'all' | undefined) {
  const filter = { where: {} }
  if (timeFrame === 'future')
    filter.where = {
      date: {
        gte: new Date(),
      },
    }
  if (timeFrame === 'past')
    filter.where = {
      date: {
        lte: new Date(),
      },
    }
  return await prisma.event.findMany({
    ...filter,
    select: {
      id: true,
      name: true,
      date: true,
      occasion: true,
    },
    orderBy: {
      date: timeFrame === 'past' ? 'desc' : 'asc',
    },
  })
}

export async function getById(id: any) {
  return await prisma.event.findUnique({
    where: {
      id: Number.parseInt(id),
    },
    select: {
      id: true,
      name: true,
      date: true,
      occasion: {
        select: {
          id: true,
          name: true,
        },
      },
      assignments: {
        select: {
          service: true,
          comment: true,
          user: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  })
}

export async function getForPdf(id: any) {
  const event = await prisma.event.findUnique({
    where: {
      id: Number.parseInt(id),
    },
    select: {
      id: true,
      name: true,
      date: true,
      occasion: {
        select: {
          id: true,
          name: true,
        },
      },
      schedule: {
        select: {
          position: true,
          title: true,
          source: true,
          sourceRef: true,
          remarks: true,
          events: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
      assignments: {
        select: {
          service: true,
          user: true,
          comment: true,
        },
      },
    },
  })
  return event
}
