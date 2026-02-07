import Link from 'next/link'

import { StoreCard } from '@/components/card'
import { PageHeader } from '@/components/common'
import { EmployerMainContainer } from '@/components/containers'
import { Button } from '@/components/ui/button'
import { getStoresByCompanyId } from '@/services'

export default async function StoresPage({ params }: { params: Promise<{ companyId: string }> }) {
  const companyId = (await params).companyId
  const stores = await getStoresByCompanyId(companyId)

  return (
    <EmployerMainContainer>
      <PageHeader
        title="Stores"
        description="Manage your store lists"
        action={
          <Button asChild>
            <Link href={`/employer/companies/${companyId}/stores/create`}>Add Store</Link>
          </Button>
        }
      />

      {!stores ? (
        <p className="text-muted-foreground">No stores registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(480px,1fr))] gap-4">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} companyId={companyId} />
          ))}
        </div>
      )}
    </EmployerMainContainer>
  )
}
