import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { AppSidebar } from '@/components/templates/employer/app-sidebar'
import { Header } from '@/components/templates/employer/header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { auth } from '@/lib/better-auth/auth'
import { getPathname } from '@/utils'

export default async function EmployerMainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const pathname = await getPathname()

  // ログインしていない場合はログインページへリダイレクト（companies以下のすべてのページで適用）
  if (!session) {
    redirect(`/login?error=authentication_required&redirectTo=${pathname}`)
  }

  // roles が null の場合（EmployerではなくSeekerの場合）はトップページにリダイレクト（companies以下のすべてのページで適用）
  if (!session.user.roles || session.user.roles.length === 0) {
    redirect('/')
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col p-4 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
