import { Suspense } from 'react'

import { MainContainer } from '@/components/containers'
import { Card, CardContent } from '@jobpop/ui'
import { Skeleton } from '@jobpop/ui'

import { NoticeCard } from './notice-card'

export default function EmployerDashboardPage() {
  return (
    <MainContainer>
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
    </MainContainer>
  )
}
