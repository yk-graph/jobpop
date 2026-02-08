import { Company, EmployeeRole } from '@prisma/client'

import { prisma } from '@/lib/prisma'

export async function getRolesByUserId(userId: string): Promise<EmployeeRole[] | null> {
  const employees = await prisma.employee.findMany({
    where: { userId },
    select: { role: true },
  })

  if (!employees.length) {
    return null
  }

  return employees.map((employee) => employee.role)
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

export async function getCompanyByUserId(userId: string): Promise<Company[] | null> {
  const employees = await prisma.employee.findMany({
    where: { userId },
    select: {
      company: true,
    },
  })

  if (!employees.length) {
    return null
  }

  return employees.map((employee) => employee.company)
}
