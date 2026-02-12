import { redirect } from 'next/navigation'

import { AppSidebar } from '@/components/templates/employer/app-sidebar'
import { Header } from '@/components/templates/employer/header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getRequiredSession } from '@/lib/better-auth/server'
import { getRoleByCompanyIdAndUserId } from '@/services'
import { isManagerOrAbove } from '@/utils'

export default async function EmployerCompanyLayout({
  params,
  children,
}: {
  params: Promise<{ companyId: string }>
  children: React.ReactNode
}) {
  const { companyId } = await params
  const session = await getRequiredSession()
  const role = await getRoleByCompanyIdAndUserId(companyId, session.user.id)

  // role が null の場合（EmployerではなくSeekerの場合）Role が Staff の場合はトップページにリダイレクト（companies以下のすべてのページで適用）
  if (!role || !isManagerOrAbove(role)) {
    redirect('/')
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session.user} role={role} />
      <SidebarInset>
        <Header />
        <div id="employer-main-container" className="flex flex-1 flex-col p-4 overflow-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
