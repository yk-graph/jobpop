import Link from 'next/link'
import { MapPin } from 'lucide-react'

import { getStoresByCompanyId } from '@/actions/store'
import { StoreCard } from '@/components/card/store-card'
import { PageHeader } from '@/components/common'
import { EmployerMainContainer } from '@/components/containers'
import { Button } from '@/components/ui/button'

export default async function StoresPage({ params }: { params: Promise<{ companyId: string }> }) {
  const companyId = (await params).companyId

  const storesResult = await getStoresByCompanyId(companyId)
  const stores = storesResult.success ? storesResult.data || [] : []

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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>

      {stores.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No stores found</p>
        </div>
      )}
    </EmployerMainContainer>
  )
}
