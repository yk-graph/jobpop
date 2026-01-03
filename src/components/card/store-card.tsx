'use client'

import Image from 'next/image'
import { MapPin, Phone } from 'lucide-react'
import { Store } from '@prisma/client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface StoreCardProps {
  store: Store
}

export function StoreCard({ store }: StoreCardProps) {
  const fullAddress = [
    store.streetAddress,
    store.floor && `Floor: ${store.floor}`,
    store.unit && `Unit: ${store.unit}`,
    store.city,
    store.province,
    store.postalCode,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <Card className="border-none py-0 sm:flex-row sm:gap-0">
      <CardContent className="grow px-0">
        {store.thumbnailUrl ? (
          <div className="relative aspect-video w-full sm:h-full sm:aspect-auto">
            <Image src={store.thumbnailUrl} alt={store.name} fill className="rounded-l-xl object-cover" />
          </div>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-muted sm:h-full sm:aspect-auto">
            <MapPin className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </CardContent>
      <div className="sm:min-w-54">
        <CardHeader className="pt-6">
          <CardTitle>{store.name}</CardTitle>
          {store.description && <CardDescription className="line-clamp-2">{store.description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-2 pb-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">{fullAddress}</p>
          </div>

          {store.phoneNumber && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">{store.phoneNumber}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="gap-3 py-6">
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/employer/stores/${store.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
