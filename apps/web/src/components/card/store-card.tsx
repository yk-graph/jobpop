import { ChevronRight, ImageOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StoreWithJobs } from '@/types'

interface StoreCardProps {
  store: StoreWithJobs
  companyId: string
}

export function StoreCard({ store, companyId }: StoreCardProps) {
  const totalApplicants = store.jobs.reduce((sum, job) => sum + job._count.applications, 0)
  const basePath = `/employer/companies/${companyId}`

  return (
    <Card className="relative flex-row gap-0 overflow-hidden py-0 transition-colors hover:bg-muted/50">
      {/* Stretched link - カード全体をクリック可能にする */}
      <Link href={`${basePath}/stores/${store.id}`} className="absolute inset-0 z-10" aria-label={store.name} />

      <div className="min-w-[25%] max-w-[40%] shrink-0 bg-muted">
        {store.thumbnailUrl ? (
          <div className="relative h-full w-full">
            <Image src={store.thumbnailUrl} alt={store.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageOff className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col py-4">
        <CardHeader>
          <CardTitle>{store.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm">
          <div className="flex items-center">
            <span className="w-24 text-muted-foreground">Open Jobs</span>
            <span>{store.jobs.length}</span>
            <Button variant="ghost" size="icon" className="relative z-20 ml-auto h-6 w-6" asChild>
              <Link href={`${basePath}/jobs`}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="flex items-center">
            <span className="w-24 text-muted-foreground">Applicants</span>
            <span>{totalApplicants}</span>
            <Button variant="ghost" size="icon" className="relative z-20 ml-auto h-6 w-6" asChild>
              <Link href={`${basePath}/applicants`}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
