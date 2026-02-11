import { JobStatus, Store } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { StoreWithJobs } from '@/types'

export async function getStoreById(storeId: string): Promise<Store | null> {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
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
