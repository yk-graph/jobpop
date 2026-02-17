import { headers } from 'next/headers'

import { MenuButton } from '@/components/button'
import { auth } from '@/lib/better-auth/auth'
import { EmployeeRole } from '@jobpop/database'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const isLoggedIn = !!session
  // スタッフは企業側のページにアクセスできないため、スタッフでない＝企業側のユーザーと判断する
  const isEmployer = session && session.user.roles ? !session.user.roles.includes(EmployeeRole.STAFF) : false

  return (
    <div className="h-svh w-full flex justify-center items-center p-6">
      <MenuButton isLoggedIn={isLoggedIn} isEmployer={isEmployer} />
      {children}
    </div>
  )
}
