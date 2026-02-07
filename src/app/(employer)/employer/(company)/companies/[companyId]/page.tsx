import { Suspense } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { NoticeCard } from './notice-card'

export default async function DashboardPage({ params }: { params: Promise<{ companyId: string }> }) {
  console.log('DashboardPage params:', await params) // 追加: パラメータのログ出力

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <NoticeCard />
      </Suspense>

      <div className="flex flex-wrap gap-4">
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
    </div>
  )
}
