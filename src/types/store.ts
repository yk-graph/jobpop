import { Prisma } from '@prisma/client'

// Tips: StoreGetPayloadを使うとPrismaクエリの結果の型を簡単に定義できる
export type StoreWithJobs = Prisma.StoreGetPayload<{
  include: { jobs: { include: { _count: { select: { applications: true } } } } }
}>
