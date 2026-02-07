import { Suspense } from 'react'

import { EmployerMainContainer } from '@/components/containers'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { NoticeCard } from './notice-card'

export default function DashboardPage() {
  return (
    <EmployerMainContainer>
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <NoticeCard />
      </Suspense>

      <div className="flex flex-wrap gap-6">
        <Card className="min-w-[400px] flex-1">
          <CardContent>hoge</CardContent>
        </Card>
        <Card className="min-w-[400px] flex-1">
          <CardContent>hoge</CardContent>
        </Card>
        <Card className="min-w-[400px] flex-1">
          <CardContent>hoge</CardContent>
        </Card>
      </div>
    </EmployerMainContainer>
  )
}
