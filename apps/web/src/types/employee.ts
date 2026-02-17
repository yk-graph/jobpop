import { Company, Employee, Prisma, Store, User } from '@jobpop/database'

export type CurrentEmployee = Employee & {
  user: User
  company: Company
  store: Store | null
}

export type EmployeeWithUser = Prisma.EmployeeGetPayload<{
  include: { user: true }
}>
