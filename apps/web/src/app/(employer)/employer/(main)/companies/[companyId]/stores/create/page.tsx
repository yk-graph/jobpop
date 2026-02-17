import { PageHeader } from '@/components/common'
import { EmployerMainContainer } from '@/components/containers'
import { CreateStoreForm } from '@/components/form'

export default async function CreateStorePage({ params }: { params: Promise<{ companyId: string }> }) {
  const companyId = (await params).companyId

  return (
    <EmployerMainContainer>
      <PageHeader title="Create Store" description="Create and manage your store locations here." />

      <CreateStoreForm companyId={companyId} />
    </EmployerMainContainer>
  )
}
