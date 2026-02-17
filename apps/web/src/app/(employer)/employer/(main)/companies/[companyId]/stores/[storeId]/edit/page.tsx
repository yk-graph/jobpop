import { notFound, redirect } from 'next/navigation'

import { PageHeader } from '@/components/common'
import { EmployerMainContainer } from '@/components/containers'
import { UpdateStoreForm } from '@/components/form'
import { getRequiredSession } from '@/lib/better-auth/server'
import { getRoleByCompanyIdAndUserId, getStoreById } from '@/services'
import { isAdminOrAbove } from '@/utils'

export default async function EditStorePage({ params }: { params: Promise<{ companyId: string; storeId: string }> }) {
  const session = await getRequiredSession()
  const { companyId, storeId } = await params
  const store = await getStoreById(storeId)

  if (!store) {
    notFound()
  }

  const role = await getRoleByCompanyIdAndUserId(companyId, session.user.id)

  // ADMIN以上でない場合はリダイレクト
  if (!isAdminOrAbove(role)) {
    redirect(`/employer/companies/${companyId}/stores/${storeId}`)
  }

  return (
    <EmployerMainContainer>
      <PageHeader title="Edit Store" description="Update your store information." />

      <UpdateStoreForm store={store} />
    </EmployerMainContainer>
  )
}
