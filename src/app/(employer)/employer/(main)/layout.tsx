import { redirect } from 'next/navigation'

import { Header } from '@/components/templates/employer/header'
import { AppSidebar } from '@/components/templates/employer/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'
import { getCurrentRoleByUserId, getUserById } from '@/actions'

export default async function EmployerMainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    redirect('/employer/login')
  }

  const [user, role] = await Promise.all([await getUserById(userId), await getCurrentRoleByUserId(userId)])

  if (!user.success || !user.data || !role.success || !role.data) {
    throw new Error('Failed to fetch user or role data')
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user.data} role={role.data} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
