import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/common'
import { EmployerMainContainer } from '@/components/containers'
import { getRequiredSession } from '@/lib/better-auth/server'
import { getCompanyById, getRoleByCompanyIdAndUserId } from '@/services'

import { CompanyDetailContents } from './company-detail-contents'

export default async function EmployerCompanyDetailPage({ params }: { params: Promise<{ companyId: string }> }) {
  const session = await getRequiredSession()
  const { companyId } = await params
  const company = await getCompanyById(companyId)

  if (!company) {
    notFound()
  }

  const role = await getRoleByCompanyIdAndUserId(companyId, session.user.id)

  return (
    <EmployerMainContainer>
      <PageHeader title="Company Details" />
      <CompanyDetailContents company={company} role={role} />
    </EmployerMainContainer>
  )
}
