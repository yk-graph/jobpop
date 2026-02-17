import { Prisma } from '@jobpop/database'

// Tips: StoreGetPayloadを使うとPrismaクエリの結果の型を簡単に定義できる
export type StoreWithJobs = Prisma.StoreGetPayload<{
  include: { jobs: { include: { _count: { select: { applications: true } } } } }
}>

export type StoreDetail = Prisma.StoreGetPayload<{
  include: {
    jobs: true
    businessHours: true
    employees: {
      include: { user: { select: { name: true } } }
    }
  }
}>
