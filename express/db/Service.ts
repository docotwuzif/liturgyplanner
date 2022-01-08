import prisma from './prisma'

export async function getAll() {
  return await prisma.service.findMany()
}
