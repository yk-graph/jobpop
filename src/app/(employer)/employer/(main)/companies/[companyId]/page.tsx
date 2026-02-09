import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

import { PageHeader } from '@/components/common'
import { EmployerMainContainer } from '@/components/containers'
import { auth } from '@/lib/better-auth/auth'
import { getCompanyById, getRoleByCompanyIdAndUserId } from '@/services'
import { getPathname } from '@/utils'

import { CompanyDetailContents } from './company-detail-contents'

export default async function EmployerCompanyDetailPage({ params }: { params: Promise<{ companyId: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const pathname = await getPathname()

  if (!session) {
    redirect(`/login?error=authentication_required&redirectTo=${pathname}`)
  }

  const { companyId } = await params
  const company = await getCompanyById(companyId)

  if (!company) {
    notFound()
  }

  const currentRole = await getRoleByCompanyIdAndUserId(companyId, session.user.id)

  return (
    <EmployerMainContainer>
      <PageHeader title="Company Details" />
      <CompanyDetailContents company={company} currentRole={currentRole} />
    </EmployerMainContainer>
  )
}
