import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/common'
import { EmployerMainContainer } from '@/components/containers'
import { UpdateCompanyForm } from '@/components/form'
import { getCompanyById } from '@/services'

export default async function EditCompanyPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params
  const company = await getCompanyById(companyId)

  if (!company) {
    notFound()
  }

  return (
    <EmployerMainContainer>
      <PageHeader title="Edit Company" description="Update your company information." />

      <UpdateCompanyForm company={company} />
    </EmployerMainContainer>
  )
}
