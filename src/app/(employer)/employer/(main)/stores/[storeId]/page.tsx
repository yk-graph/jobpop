import { redirect } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Phone, Store as StoreIcon, Users } from 'lucide-react'

import { getCurrentCompany } from '@/actions/company'
import { getStoreById } from '@/actions/store'
import { CardHeader } from '@/components/card'
import { InfoDescription, InfoItem, InfoWrapper, PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { auth } from '@/lib/auth'

interface StoreDetailPageProps {
  params: Promise<{ storeId: string }>
}

export default async function StoreDetailPage({ params }: StoreDetailPageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/employer/login')
  }

  const companyResult = await getCurrentCompany(session.user.id)

  if (!companyResult.success || !companyResult.data) {
    redirect('/employer/initialize')
  }

  const { storeId } = await params
  const storeResult = await getStoreById(storeId)

  if (!storeResult.success || !storeResult.data) {
    redirect('/employer/stores')
  }

  const store = storeResult.data

  if (store.companyId !== companyResult.data.id) {
    redirect('/employer/stores')
  }

  const fullAddress = [
    store.streetAddress,
    store.floor && `Floor: ${store.floor}`,
    store.unit && `Unit: ${store.unit}`,
    store.city,
    store.province,
    store.postalCode,
    store.country,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="container max-w-full space-y-6">
      <PageHeader
        title="Store Details"
        description="View and manage your store information"
        action={<Button variant="outline">Edit Store</Button>}
      />

      <Card className="border-none">
        <CardHeader
          title={store.name}
          description={`Store ID: ${store.id}`}
          icon={StoreIcon}
          titleSize="2xl"
          copyValue={store.id}
        />
        <CardContent className="space-y-6">
          {store.thumbnailUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image src={store.thumbnailUrl} alt={store.name} fill className="object-cover" />
            </div>
          )}

          {store.description && (
            <div className="space-y-1">
              <h3 className="font-semibold">Description</h3>
              <p className="text-sm text-muted-foreground">{store.description}</p>
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Contact Information</h3>

            <div className="grid gap-3">
              <InfoItem icon={Phone} label="Phone" value={store.phoneNumber} />
              <InfoItem icon={MapPin} label="Address" value={fullAddress} />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Location</h3>

            <InfoWrapper responsive={false}>
              <InfoDescription label="Latitude" value={store.lat.toString()} />
              <InfoDescription label="Longitude" value={store.lng.toString()} />
            </InfoWrapper>
          </div>

          <Separator />

          <InfoWrapper responsive={false}>
            <InfoDescription label="Created" value={new Date(store.createdAt).toLocaleDateString()} />
            <InfoDescription label="Last Updated" value={new Date(store.updatedAt).toLocaleDateString()} />
          </InfoWrapper>
        </CardContent>
      </Card>

      <Card className="border-none">
        <CardHeader title="Address Details" titleSize="lg" />
        <CardContent>
          <InfoWrapper>
            <InfoDescription label="Street Address" value={store.streetAddress} />
            <InfoDescription label="Floor" value={store.floor} />
            <InfoDescription label="Unit" value={store.unit} />
            <InfoDescription label="City" value={store.city} />
            <InfoDescription label="Province" value={store.province} />
            <InfoDescription label="Postal Code" value={store.postalCode} />
            <InfoDescription label="Country" value={store.country} />
          </InfoWrapper>
        </CardContent>
      </Card>

      <Card className="border-none">
        <CardHeader title="Employees" description={`${store.employees.length} employees`} icon={Users} titleSize="lg" />
        <CardContent>
          {store.employees.length > 0 ? (
            <div className="space-y-2">
              {store.employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{employee.id}</p>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No employees assigned to this store</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
