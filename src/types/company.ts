import { Prisma } from '@prisma/client'

// Tips: StoreGetPayloadを使うとPrismaクエリの結果の型を簡単に定義できる
export type CompanyWithStoresAndEmployees = Prisma.CompanyGetPayload<{
  include: {
    stores: true
    employees: true
  }
}>
