import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/common'
import { EmployerMainContainer } from '@/components/containers'
import { getRequiredSession } from '@/lib/better-auth/server'
import { getRoleByCompanyIdAndUserId, getStoreById } from '@/services'

import { StoreDetailContents } from './store-detail-contents'

export default async function EmployerStoreDetailPage({
  params,
}: {
  params: Promise<{ companyId: string; storeId: string }>
}) {
  const session = await getRequiredSession()
  const { companyId, storeId } = await params
  const store = await getStoreById(storeId)

  if (!store) {
    notFound()
  }

  const role = await getRoleByCompanyIdAndUserId(companyId, session.user.id)

  return (
    <EmployerMainContainer>
      <PageHeader title="Store Details" />
      <StoreDetailContents store={store} companyId={companyId} role={role} />
    </EmployerMainContainer>
  )
}
