import { UserRole, AuthProvider, Prisma } from '@prisma/client'
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
      email: true,
      role: true,
    },
    orderBy: [
      {
        surname: 'asc',
      },
      { givenName: 'asc' },
    ],
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

export async function update(id: any, data: any) {
  const updateData: Prisma.UserUpdateInput = {}
  if (data.role) {
    if (!['ADMIN', 'EDITOR', 'USER', 'GUEST'].includes(data.role))
      throw new TypeError('User role not valid.')
    else updateData.role = data.role
  }
  if (data.qualifiedFor) {
    if (data.qualifiedFor.some((x: any) => typeof x !== 'number'))
      throw new TypeError('Qualification id not valid.')
    else
      updateData.qualifiedFor = {
        set: data.qualifiedFor.map((x: Number) => ({
          id: x,
        })),
      }
  }
  return await prisma.user.update({
    where: { id: Number.parseInt(id) },
    select: { qualifiedFor: true },
    data: updateData,
  })
}

export async function getUserData(id: any, pfp?: any) {
  const userDataDb = await prisma.user.findUnique({
    where: {
      id: Number.parseInt(id),
    },
  })

  if (!userDataDb) throw new Error('User not found')

  if (userDataDb.authProvider === AuthProvider.AAD) {
    const authToken = await Graph.getAuthToken()
    if (pfp === true) pfp = '240x240'
    if (
      [
        '48x48',
        '64x64',
        '96x96',
        '120x120',
        '240x240',
        '360x360',
        '432x432',
        '504x504',
        '648x648',
      ].includes(pfp) ||
      typeof pfp === 'undefined' ||
      pfp === false
    ) {
      const userDataAAD = await Graph.getUserById(authToken, userDataDb.uid, {
        include: { pfp },
      })
      return { ...userDataDb, _aad: userDataAAD }
    } else throw new Error('Picture arguments not valid.')
  } else {
    throw new Error('Unknown auth provider')
  }
}
