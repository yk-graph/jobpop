import { redirect } from 'next/navigation'

import { Header } from '@/components/templates/employer/header'
import { AppSidebar } from '@/components/templates/employer/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'
import { getUserById } from '@/actions'

export default async function EmployerDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    redirect('/employer/login')
  }

  const user = await getUserById(userId)

  if (!user.success || !user.data) {
    throw new Error(user.message)
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user.data} />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
