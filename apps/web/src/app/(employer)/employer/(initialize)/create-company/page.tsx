import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { CreateCompanyForm } from '@/components/form'
import { FullScreenContainer, MiddleScreenContainer } from '@jobpop/ui'
import { auth } from '@/lib/better-auth/auth'
import { getPathname } from '@/utils'

export default async function EmployerCreateCompanyPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const pathname = await getPathname()

  if (!session) {
    redirect(`/login?error=authentication_required&redirectTo=${pathname}`)
  }

  return (
    <FullScreenContainer>
      <MiddleScreenContainer>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create Company</h1>
          <p className="text-stone-300">Please input your company information to get started.</p>
        </div>
        <CreateCompanyForm />
      </MiddleScreenContainer>
    </FullScreenContainer>
  )
}
