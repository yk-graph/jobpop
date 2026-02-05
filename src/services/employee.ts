import { EmployeeRole } from '@prisma/client'

import { prisma } from '@/lib/prisma'

export async function getRolesByUserId(userId: string): Promise<EmployeeRole[] | null> {
  const employees = await prisma.employee.findMany({
    where: { userId },
    select: { role: true },
  })

  if (employees.length === 0) {
    return null
  }

  return employees.map((employee) => employee.role)
}
