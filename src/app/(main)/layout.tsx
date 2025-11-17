import { redirect } from 'next/navigation'

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
    <div className="h-svh w-full flex justify-center items-center p-6">
      <MenuButton />
      {children}
    </div>
  )
}
