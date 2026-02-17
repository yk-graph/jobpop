import { notFound, redirect } from 'next/navigation'

import { MainContainer } from '@/components/containers'
import { UpdateStoreForm } from '@/components/form'
import { PageHeader } from '@jobpop/ui'
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
    <MainContainer>
      <PageHeader title="Edit Store" description="Update your store information." />

      <UpdateStoreForm store={store} />
    </MainContainer>
  )
}
