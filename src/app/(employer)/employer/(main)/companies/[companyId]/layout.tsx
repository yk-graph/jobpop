import { EmployeeRole } from '@prisma/client'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { AppSidebar } from '@/components/templates/employer/app-sidebar'
import { Header } from '@/components/templates/employer/header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { auth } from '@/lib/better-auth/auth'
import { getRoleByCompanyIdAndUserId } from '@/services'
import { getPathname } from '@/utils'

export default async function EmployerCompanyLayout({
  params,
  children,
}: {
  params: Promise<{ companyId: string }>
  children: React.ReactNode
}) {
  const { companyId } = await params
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const pathname = await getPathname()

  // ログインしていない場合はログインページへリダイレクト（companies以下のすべてのページで適用）
  if (!session) {
    redirect(`/login?error=authentication_required&redirectTo=${pathname}`)
  }

  const role = await getRoleByCompanyIdAndUserId(companyId, session.user.id)

  // role が null の場合（EmployerではなくSeekerの場合）、Role が Staff の場合はトップページにリダイレクト（companies以下のすべてのページで適用）
  if (!role || role === EmployeeRole.STAFF) {
    redirect('/')
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session.user} role={role} />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col p-4 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
