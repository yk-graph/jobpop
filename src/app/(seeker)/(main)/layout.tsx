// import { SessionProvider } from 'next-auth/react'
// import { redirect } from 'next/navigation'

// import { auth } from '@/lib/auth'
// import { getProfileByUserId } from '@/actions'
// import { MenuButton } from '@/components/button'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  // const session = await auth()
  // const userId = session?.user?.id

  // if (userId) {
  //   const profile = await getProfileByUserId(userId)
  //   if (!profile.success) {
  //     redirect('/settings/initial')
  //   }
  // }

  return (
    // <SessionProvider>
    <div className="h-svh w-full flex justify-center items-center p-6">
      {/* <MenuButton /> */}
      {children}
    </div>
    // </SessionProvider>
  )
}
