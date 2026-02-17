import { JobStatus } from '@jobpop/database'

import { prisma } from '@/lib/prisma'
import { StoreDetail, StoreWithJobs } from '@/types'

export async function getStoreById(storeId: string): Promise<StoreDetail | null> {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: {
      jobs: true,
      businessHours: true,
      employees: {
        include: {
          user: {
            select: { name: true },
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
        where: { status: JobStatus.PUBLISHED }, // 公開中の求人のみを含める
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
