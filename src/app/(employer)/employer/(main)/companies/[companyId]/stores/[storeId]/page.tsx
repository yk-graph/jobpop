import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

import { PageHeader } from '@/components/common'
import { EmployerMainContainer } from '@/components/containers'
import { auth } from '@/lib/better-auth/auth'
import { getRoleByCompanyIdAndUserId, getStoreById } from '@/services'
import { getPathname } from '@/utils'

import { StoreDetailContents } from './store-detail-contents'

export default async function EmployerStoreDetailPage({
  params,
}: {
  params: Promise<{ companyId: string; storeId: string }>
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const pathname = await getPathname()

  if (!session) {
    redirect(`/login?error=authentication_required&redirectTo=${pathname}`)
  }

  const { companyId, storeId } = await params
  const store = await getStoreById(storeId)

  if (!store) {
    notFound()
  }

  const currentRole = await getRoleByCompanyIdAndUserId(companyId, session.user.id)

  return (
    <EmployerMainContainer>
      <PageHeader title="Store Details" />
      <StoreDetailContents store={store} companyId={companyId} currentRole={currentRole} />
    </EmployerMainContainer>
  )
}
