import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { MiddleScreenContainer } from '@/components/containers'
import { CreateCompanyForm } from '@/components/form'
import { auth } from '@/lib/better-auth/auth'

export default async function EmployerCreateCompanyPage() {
  const data = await auth.api.getSession({
    headers: await headers(),
  })

  if (!data) {
    redirect('/login?error=authentication_required&redirectTo=/employer/initialize/create-company')
  }

  return (
    <MiddleScreenContainer>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Create Company</h1>
        <p className="text-stone-300">Please input your company information to get started.</p>
      </div>

      <CreateCompanyForm />
    </MiddleScreenContainer>
  )
}
