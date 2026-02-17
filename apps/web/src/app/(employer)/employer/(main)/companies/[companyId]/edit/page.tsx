import { notFound, redirect } from 'next/navigation'

import { UpdateCompanyForm } from '@/components/form'
import { MainContainer, PageHeader } from '@jobpop/ui'
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
    <MainContainer>
      <PageHeader title="Edit Company" description="Update your company information." />

      <UpdateCompanyForm company={company} />
    </MainContainer>
  )
}
