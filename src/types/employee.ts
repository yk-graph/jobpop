import { Company, Employee, Store, User } from '@prisma/client'

export type CurrentEmployee = Employee & {
  user: User
  company: Company
  store: Store | null
}
