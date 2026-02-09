'use client'

import Image from 'next/image'
import Link from 'next/link'
import { EmployeeRole, Store } from '@prisma/client'
import { MapPin, Phone, Store as StoreIcon } from 'lucide-react'
import { Element } from 'react-scroll'

import { CardHeader } from '@/components/card'
import { InfoDescription, InfoItem, InfoWrapper, ScrollNav } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { isAdminOrAbove } from '@/utils'

const navItems = [
  { label: 'Detail', to: 'detail' },
  { label: 'Open Jobs', to: 'jobs' },
  { label: 'Members', to: 'members' },
]

interface StoreDetailContentsProps {
  store: Store
  companyId: string
  currentRole: EmployeeRole | null
}

export function StoreDetailContents({ store, companyId, currentRole }: StoreDetailContentsProps) {
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
            copyValue={store.id}
            action={
              currentRole && isAdminOrAbove(currentRole) ? (
                <Button size={'sm'} asChild>
                  <Link href={`/employer/companies/${companyId}/stores/${store.id}/edit`}>Edit</Link>
                </Button>
              ) : null
            }
          />
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Thumbnail */}
              <div className="relative w-full md:w-2/5 md:max-w-lg aspect-video overflow-hidden rounded-lg">
                {store.thumbnailUrl ? (
                  <Image src={store.thumbnailUrl} alt={store.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <StoreIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Description & Contact */}
              <div className="flex-1 space-y-4">
                {store.description && (
                  <div className="space-y-1">
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-sm text-muted-foreground">{store.description}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="font-semibold">Contact Information</h3>
                  <div className="grid gap-2">
                    <InfoItem icon={Phone} label="Phone" value={store.phoneNumber} copyValue={store.phoneNumber} />
                    <InfoItem icon={MapPin} label="Address" value={fullAddress} copyValue={fullAddress} />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Address Details */}
            <div className="space-y-4">
              <h3 className="font-semibold">Address Details</h3>
              <InfoWrapper>
                <InfoDescription label="Street Address" value={store.streetAddress} />
                <InfoDescription label="Floor" value={store.floor} />
                <InfoDescription label="Unit" value={store.unit} />
                <InfoDescription label="City" value={store.city} />
                <InfoDescription label="Province" value={store.province} />
                <InfoDescription label="Postal Code" value={store.postalCode} />
                <InfoDescription label="Country" value={store.country} />
              </InfoWrapper>
            </div>

            <Separator />

            {/* Location */}
            <div className="space-y-4">
              <h3 className="font-semibold">Location</h3>
              <InfoWrapper responsive={false}>
                <InfoDescription label="Latitude" value={store.lat.toString()} />
                <InfoDescription label="Longitude" value={store.lng.toString()} />
              </InfoWrapper>
            </div>
          </CardContent>
        </Card>
      </Element>

      {/* Jobs Section */}
      <Element name="jobs">
        <Card className="border-none">
          <CardHeader title="Open Jobs" titleSize="lg" />
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
