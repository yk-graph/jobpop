import { prisma } from '@/lib/prisma'
import { CompanyWithStoresAndEmployees } from '@/types'

export async function getCompanyById(companyId: string): Promise<CompanyWithStoresAndEmployees | null> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      stores: true,
      employees: true,
    },
  })

  if (!company) return null

  return company
}
