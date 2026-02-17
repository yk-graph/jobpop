import { Company } from '@jobpop/database'

import { prisma } from '@/lib/prisma'

export async function getCompaniesByUserId(userId: string): Promise<Company[] | null> {
  const employees = await prisma.employee.findMany({
    where: { userId },
    select: {
      company: true,
    },
  })

  if (!employees.length) {
    return null
  }

  const conpanies = employees.map((employee) => employee.company)
  return conpanies
}

export async function getCompanyById(companyId: string): Promise<Company | null> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  })

  if (!company) return null

  return company
}
