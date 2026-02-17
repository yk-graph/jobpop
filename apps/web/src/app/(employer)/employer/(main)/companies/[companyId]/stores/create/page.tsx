import { CreateStoreForm } from '@/components/form'
import { MainContainer, PageHeader } from '@jobpop/ui'

export default async function CreateStorePage({ params }: { params: Promise<{ companyId: string }> }) {
  const companyId = (await params).companyId

  return (
    <MainContainer>
      <PageHeader title="Create Store" description="Create and manage your store locations here." />

      <CreateStoreForm companyId={companyId} />
    </MainContainer>
  )
}
