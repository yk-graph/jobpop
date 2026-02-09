import { notFound, redirect } from 'next/navigation'

import { PageHeader } from '@/components/common'
import { EmployerMainContainer } from '@/components/containers'
import { UpdateCompanyForm } from '@/components/form'
import { getRequiredSession } from '@/lib/better-auth/server'
import { getCompanyById, getRoleByCompanyIdAndUserId } from '@/services'
import { isAdminOrAbove } from '@/utils'

export default async function EditCompanyPage({ params }: { params: Promise<{ companyId: string }> }) {
  const session = await getRequiredSession()
  const { companyId } = await params
  const company = await getCompanyById(companyId)

  if (!company) {
    notFound()
  }

  const role = await getRoleByCompanyIdAndUserId(companyId, session.user.id)

  // ADMIN以上でない場合はリダイレクト
  if (!isAdminOrAbove(role)) {
    redirect(`/employer/companies/${companyId}`)
  }

  return (
    <EmployerMainContainer>
      <PageHeader title="Edit Company" description="Update your company information." />

      <UpdateCompanyForm company={company} />
    </EmployerMainContainer>
  )
}
