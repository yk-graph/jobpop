import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { FullScreenContainer, MiddleScreenContainer } from '@/components/containers'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/better-auth/auth'
import { getCompanyByUserId } from '@/services'
import { getPathname } from '@/utils'
import Link from 'next/link'

export default async function EmployerCompanyPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const pathname = await getPathname()

  if (!session) {
    redirect(`/login?error=authentication_required&redirectTo=${pathname}`)
  }

  // STAFF ロールを持っているユーザーは企業ページにアクセスできないようにする
  if (!session.user.roles || session.user.roles.includes('STAFF')) {
    redirect('/')
  }

  const companies = await getCompanyByUserId(session.user.id)

  if (!companies) {
    redirect('/')
  }

  if (companies.length === 1) {
    redirect(`/employer/companies/${companies[0].id}`)
  }

  return (
    <FullScreenContainer>
      <MiddleScreenContainer>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="text-stone-300">Please select a company to manage</p>
        </div>
        <div className="space-y-4">
          {companies.map((company) => (
            <Button key={company.id} variant="outline" className="p-10" asChild>
              <Link href={`/employer/companies/${company.id}`} className="text-xl font-semibold">
                {company.name}
              </Link>
            </Button>
          ))}
        </div>
      </MiddleScreenContainer>
    </FullScreenContainer>
  )
}
