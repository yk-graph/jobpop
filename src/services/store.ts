import { prisma } from '@/lib/prisma'
import { StoreWithJobs } from '@/types'

export async function getStoreById(storeId: string): Promise<StoreWithJobs | null> {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: {
      jobs: {
        include: {
          _count: {
            select: { applications: true },
          },
        },
      },
    },
  })

  if (!store) return null

  return store
}

export async function getStoresByCompanyId(companyId: string): Promise<StoreWithJobs[] | null> {
  const stores = await prisma.store.findMany({
    where: { companyId },
    include: {
      jobs: {
        include: {
          _count: {
            select: { applications: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (stores.length === 0) return null

  return stores
}
