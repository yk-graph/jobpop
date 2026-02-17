import { Suspense } from 'react'

import { MainContainer } from '@/components/containers'
import { PageHeader, ScrollNav, Skeleton } from '@jobpop/ui'
import { getRequiredSession } from '@/lib/better-auth/server'
import { getRoleByCompanyIdAndUserId } from '@/services'

import DetailSection from './detail-section'

const navItems = [
  { label: 'Detail', to: 'detail' },
  { label: 'Open Jobs', to: 'jobs' },
  { label: 'Applicants', to: 'applicants' },
]

export default async function EmployerStoreDetailPage({
  params,
}: {
  params: Promise<{ companyId: string; storeId: string }>
}) {
  const { companyId, storeId } = await params
  const session = await getRequiredSession()

  const role = await getRoleByCompanyIdAndUserId(companyId, session.user.id)

  return (
    <MainContainer>
      <PageHeader title="Store Details" />

      <ScrollNav items={navItems} containerId="employer-main-c
      ontainer" />

      <Suspense fallback={<Skeleton className="h-20 sm:h-40 w-full" />}>
        <DetailSection companyId={companyId} storeId={storeId} role={role} />
      </Suspense>

      {/* TODO: Implement JobsSection and ApplicantsSection */}
      {/* <Suspense fallback={<Skeleton className="h-20 sm:h-40 w-full" />}>
        <JobsSection companyId={companyId} />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-20 sm:h-40 w-full" />}>
        <ApplicantsSection companyId={companyId} />
      </Suspense> */}
    </MainContainer>
  )
}
