import { Employee, Store } from '@prisma/client'

export type StoreWithEmployees = Store & {
  employees: Employee[]
}
