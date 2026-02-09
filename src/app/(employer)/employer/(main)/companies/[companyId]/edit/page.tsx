import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

import { PageHeader } from '@/components/common'
import { EmployerMainContainer } from '@/components/containers'
import { UpdateCompanyForm } from '@/components/form'
import { auth } from '@/lib/better-auth/auth'
import { getCompanyById, getRoleByCompanyIdAndUserId } from '@/services'
import { isAdminOrAbove } from '@/utils'

export default async function EditCompanyPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error('Authentication required')
  }

  const company = await getCompanyById(companyId)

  if (!company) {
    notFound()
  }

  const currentRole = await getRoleByCompanyIdAndUserId(companyId, session.user.id)

  // ADMIN以上でない場合はリダイレクト
  if (!isAdminOrAbove(currentRole)) {
    redirect(`/employer/companies/${companyId}`)
  }

  return (
    <EmployerMainContainer>
      <PageHeader title="Edit Company" description="Update your company information." />

      <UpdateCompanyForm company={company} />
    </EmployerMainContainer>
  )
}
