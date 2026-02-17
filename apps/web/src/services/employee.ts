import { EmployeeRole } from '@jobpop/database'

import { prisma } from '@/lib/prisma'
import { EmployeeWithUser } from '@/types'

export async function getRolesByUserId(userId: string): Promise<EmployeeRole[] | null> {
  const employees = await prisma.employee.findMany({
    where: { userId },
    select: { role: true },
  })

  if (!employees.length) {
    return null
  }

  const roles = employees.map((employee) => employee.role)
  return roles
}

export async function getRoleByCompanyIdAndUserId(companyId: string, userId: string): Promise<EmployeeRole | null> {
  const employee = await prisma.employee.findFirst({
    where: {
      companyId,
      userId,
    },
    select: {
      role: true,
    },
  })

  if (!employee) {
    return null
  }

  return employee.role
}

export async function getEmployeesByCompanyId(companyId: string): Promise<EmployeeWithUser[] | null> {
  const results = await prisma.employee.findMany({
    where: { companyId },
    include: { user: true },
  })

  if (!results.length) {
    return null
  }

  // Tips: new Map を使って重複を排除するテクニック
  const employees = Array.from(new Map(results.map((result) => [result.userId, result])).values())

  return employees
}
