import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { FullScreenContainer } from '@/components/containers'
import { auth } from '@/lib/better-auth/auth'
import { getPathname } from '@/utils'

export default async function EmployerInitializeLayout({ children }: { children: React.ReactNode }) {
  const data = await auth.api.getSession({
    headers: await headers(),
  })

  const pathname = await getPathname()

  if (!data) {
    redirect(`/login?error=authentication_required&redirectTo=${pathname}`)
  }

  return <FullScreenContainer>{children}</FullScreenContainer>
}
