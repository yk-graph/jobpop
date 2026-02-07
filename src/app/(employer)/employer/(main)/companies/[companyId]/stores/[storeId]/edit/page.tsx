import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/common'
import { EmployerMainContainer } from '@/components/containers'
import { UpdateStoreForm } from '@/components/form'
import { getStoreById } from '@/services'

export default async function EditStorePage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params
  const store = await getStoreById(storeId)

  if (!store) {
    notFound()
  }

  return (
    <EmployerMainContainer>
      <PageHeader title="Edit Store" description="Update your store information." />

      <UpdateStoreForm store={store} />
    </EmployerMainContainer>
  )
}
