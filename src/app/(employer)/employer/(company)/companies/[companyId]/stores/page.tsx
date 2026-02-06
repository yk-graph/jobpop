import { redirect } from 'next/navigation'
import { MapPin } from 'lucide-react'

import { getCurrentCompany } from '@/actions/company'
import { getStoresByCompanyId } from '@/actions/store'
import { StoreCard } from '@/components/card/store-card'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'

export default async function StoresPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/employer/login')
  }

  const companyResult = await getCurrentCompany(session.user.id)

  if (!companyResult.success || !companyResult.data) {
    redirect('/employer/initialize')
  }

  const storesResult = await getStoresByCompanyId(companyResult.data.id)
  const stores = storesResult.success ? storesResult.data || [] : []

  return (
    <div className="container max-w-full space-y-6">
      <PageHeader title="Stores" description="Manage your store locations" action={<Button>Add Store</Button>} />

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
    </div>
  )
}
