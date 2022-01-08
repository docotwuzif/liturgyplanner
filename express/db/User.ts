import { UserRole, AuthProvider } from '@prisma/client'
import * as Graph from '../graphConnector'
import prisma from './prisma'

export async function registerFromAAD(accessToken: any) {
  const userdata = await Graph.getCurrentUser(accessToken)

  let user = await prisma.user.findUnique({
    where: {
      uid: userdata.data.id,
    },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        authProvider: AuthProvider.AAD,
        email: userdata.data.mail,
        uid: userdata.data.id,
        name: userdata.data.displayName,
      },
    })
  }

  return user
}

export async function getAll() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      uid: true,
      qualifiedFor: true,
    },
    orderBy: {
      surname: 'asc',
    },
  })
}

export async function getAssignments(id: any) {
  return await prisma.assignment.findMany({
    where: {
      userId: Number.parseInt(id),
      event: {
        date: {
          gte: new Date(),
        },
      },
    },
    orderBy: {
      event: {
        date: 'asc',
      },
    },
    select: {
      event: true,
      service: true,
    },
  })
}

export async function getAllFromAAD() {
  const authToken = await Graph.getAuthToken()
  return await Graph.getAllUsers(authToken)
}

export async function create(data: any) {
  const { uid, authProvider, qualifiedFor } = data
  const userBasis = {
    uid,
    authProvider,
    role: UserRole.GUEST,
    qualifiedFor: {
      connect: qualifiedFor.map((x: Number) => ({ id: x })),
    },
  }
  if (authProvider === 'AAD') {
    const authToken = await Graph.getAuthToken()
    const { displayName, mail, givenName, surname } = await Graph.getUserById(
      authToken,
      uid
    )
    const user = {
      ...userBasis,
      name: displayName,
      givenName,
      surname,
      email: mail,
    }

    return await prisma.user.create({ data: user })
  }
  throw new Error('No valid auth provider.')
}
