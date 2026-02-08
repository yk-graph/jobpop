'use client'

import Image from 'next/image'
import { MapPin, Phone, Store as StoreIcon } from 'lucide-react'
import { Element } from 'react-scroll'

import { CardHeader } from '@/components/card'
import { InfoDescription, InfoItem, InfoWrapper, ScrollNav } from '@/components/common'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Store } from '@prisma/client'

const navItems = [
  { label: 'Detail', to: 'detail' },
  { label: 'Open Jobs', to: 'jobs' },
  { label: 'Members', to: 'members' },
]

interface StoreDetailContentsProps {
  store: Store
}

export function StoreDetailContents({ store }: StoreDetailContentsProps) {
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
    <>
      <ScrollNav items={navItems} />

      {/* Detail Section */}
      <Element name="detail">
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

        <Card className="mt-6 border-none">
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
      </Element>

      {/* Jobs Section */}
      <Element name="jobs">
        <Card className="border-none">
          <CardHeader title="Jobs" titleSize="lg" />
          <CardContent>
            <p className="text-muted-foreground">No jobs posted yet.</p>
          </CardContent>
        </Card>
      </Element>

      {/* Members Section */}
      <Element name="members">
        <Card className="border-none">
          <CardHeader title="Members" titleSize="lg" />
          <CardContent>
            <p className="text-muted-foreground">No members assigned yet.</p>
          </CardContent>
        </Card>
      </Element>
    </>
  )
}
