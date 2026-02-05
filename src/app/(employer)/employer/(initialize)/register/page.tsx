import Link from 'next/link'
import { headers } from 'next/headers'

import { Button } from '@/components/ui/button'
import { auth } from '@/lib/better-auth/auth'
import { redirect } from 'next/navigation'

export default async function EmployerRegisterPage() {
  const data = await auth.api.getSession({
    headers: await headers(),
  })

  if (!data) {
    redirect('/login?error=authentication_required&redirectTo=/employer/register')
  }

  const { session, user } = data

  return (
    <div className="flex w-full max-w-4/5 flex-col items-center gap-y-2 sm:max-w-sm">
      <h1 className="text-2xl font-bold">Initialize Page</h1>
      <p className="text-stone-300">Please Select Your Role</p>
      <div className="grid w-full grid-cols-2 gap-8 mt-8">
        <Button variant={'outline'} className="w-full h-20" asChild>
          <Link href="/employer/initialize/owner">Owner</Link>
        </Button>
        <Button variant={'outline'} className="w-full h-20" asChild>
          <Link href="/employer/initialize/staff">Staff</Link>
        </Button>
      </div>
    </div>
  )
}
