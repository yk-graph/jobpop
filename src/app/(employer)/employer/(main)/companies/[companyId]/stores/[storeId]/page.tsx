import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/common'
import { EmployerMainContainer } from '@/components/containers'
import { getStoreById } from '@/services'

import { StoreDetailContents } from './store-detail-contents'

export default async function EmployerStoreDetailPage({
  params,
}: {
  params: Promise<{ companyId: string; storeId: string }>
}) {
  const { companyId, storeId } = await params
  const store = await getStoreById(storeId)

  if (!store) {
    notFound()
  }

  return (
    <EmployerMainContainer>
      <PageHeader title="Store Details" />
      <StoreDetailContents store={store} companyId={companyId} />
    </EmployerMainContainer>
  )
}
