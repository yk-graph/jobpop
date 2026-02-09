import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

import { PageHeader } from '@/components/common'
import { EmployerMainContainer } from '@/components/containers'
import { UpdateStoreForm } from '@/components/form'
import { auth } from '@/lib/better-auth/auth'
import { getRoleByCompanyIdAndUserId, getStoreById } from '@/services'
import { isAdminOrAbove } from '@/utils'

export default async function EditStorePage({ params }: { params: Promise<{ companyId: string; storeId: string }> }) {
  const { companyId, storeId } = await params
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error('Authentication required')
  }

  const store = await getStoreById(storeId)

  if (!store) {
    notFound()
  }

  const currentRole = await getRoleByCompanyIdAndUserId(companyId, session.user.id)

  // ADMIN以上でない場合はリダイレクト
  if (!isAdminOrAbove(currentRole)) {
    redirect(`/employer/companies/${companyId}/stores/${storeId}`)
  }

  return (
    <EmployerMainContainer>
      <PageHeader title="Edit Store" description="Update your store information." />

      <UpdateStoreForm store={store} />
    </EmployerMainContainer>
  )
}
