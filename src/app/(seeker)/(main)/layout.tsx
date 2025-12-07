import { redirect } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'

import { getProfileByUserId } from '@/actions'
import { MenuButton } from '@/components/button'
import { auth } from '@/lib/auth'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const userId = session?.user?.id

  if (userId) {
    const profile = await getProfileByUserId(userId)
    if (!profile.success) {
      redirect('/settings/initial')
    }
  }

  return (
    <SessionProvider>
      <div className="h-svh w-full flex justify-center items-center p-6">
        <MenuButton />
        {children}
      </div>
    </SessionProvider>
  )
}
