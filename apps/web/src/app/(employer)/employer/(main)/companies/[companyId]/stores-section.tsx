import { Store } from 'lucide-react'

import { CustomCardHeader, ThumbnailWithNameCard } from '@/components/card'
import { Card, CardContent } from '@jobpop/ui'
import { getStoresByCompanyId } from '@/services'

interface StoresSectionProps {
  companyId: string
}

export default async function StoresSection({ companyId }: StoresSectionProps) {
  const stores = await getStoresByCompanyId(companyId)

  if (!stores || stores.length === 0) {
    return <p className="text-muted-foreground">No stores registered yet.</p>
  }

  return (
    <section id="stores">
      <Card className="border-none">
        <CustomCardHeader title="Stores" titleSize="lg" description={`Total Stores: ${stores.length}`} />
        <CardContent>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {stores.map((store) => (
              <ThumbnailWithNameCard
                key={store.id}
                name={store.name}
                thumbnailUrl={store.thumbnailUrl}
                href={`/employer/companies/${companyId}/stores/${store.id}`}
                size="lg"
                aspect="video"
                rounded="lg"
                fallbackIcon={Store}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
