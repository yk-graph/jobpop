import Link from 'next/link'

import { StoreCard } from '@/components/card'
import { Button, MainContainer, PageHeader } from '@jobpop/ui'
import { getStoresByCompanyId } from '@/services'

export default async function EmployerStoresPage({ params }: { params: Promise<{ companyId: string }> }) {
  const companyId = (await params).companyId
  const stores = await getStoresByCompanyId(companyId)

  return (
    <MainContainer>
      <PageHeader
        title="Stores"
        description="Manage your store lists"
        action={
          <Button asChild>
            <Link href={`/employer/companies/${companyId}/stores/create`}>Create</Link>
          </Button>
        }
      />

      {!stores ? (
        <p className="text-muted-foreground">No stores registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} companyId={companyId} />
          ))}
        </div>
      )}
    </MainContainer>
  )
}
