import { Suspense } from 'react'

import { PageHeader, ScrollNav } from '@/components/common'
import { EmployerMainContainer } from '@/components/containers'
import { Skeleton } from '@jobpop/ui'
import { getRequiredSession } from '@/lib/better-auth/server'
import { getRoleByCompanyIdAndUserId } from '@/services'

import DetailSection from './detail-section'
import MembersSection from './members-section'
import StoresSection from './stores-section'

const navItems = [
  { label: 'Detail', to: 'detail' },
  { label: 'Stores', to: 'stores' },
  { label: 'Members', to: 'members' },
]

export default async function EmployerCompanyDetailPage({ params }: { params: Promise<{ companyId: string }> }) {
  const session = await getRequiredSession()
  const { companyId } = await params

  const role = await getRoleByCompanyIdAndUserId(companyId, session.user.id)

  return (
    <EmployerMainContainer>
      <PageHeader title="Company Details" />

      <ScrollNav items={navItems} containerId="employer-main-container" />

      <Suspense fallback={<Skeleton className="h-20 sm:h-40 w-full" />}>
        <DetailSection companyId={companyId} role={role} />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-20 sm:h-40 w-full" />}>
        <StoresSection companyId={companyId} />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-20 sm:h-40 w-full" />}>
        <MembersSection companyId={companyId} />
      </Suspense>
    </EmployerMainContainer>
  )
}
