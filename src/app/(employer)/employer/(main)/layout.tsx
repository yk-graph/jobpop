// import { redirect } from 'next/navigation'

// import { getUserById } from '@/actions'
// import { AppSidebar } from '@/components/templates/employer/app-sidebar'
// import { Header } from '@/components/templates/employer/header'
// import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
// import { auth } from '@/lib/auth'

// export default async function EmployerMainLayout({ children }: { children: React.ReactNode }) {
//   const session = await auth()
//   const userId = session?.user.id
//   const isEmployer = session?.user.isEmployer
//   const role = session?.user.role

//   if (!userId) redirect('/employer/login') // 未ログインの場合、ログインページへリダイレクト
//   if (!isEmployer || !role) redirect('/') // Employerでない場合、トップページへリダイレクト
//   const currentUser = await getUserById(userId)
//   if (!currentUser.success || !currentUser.data) {
//     redirect('/employer/login')
//   }

//   return (
//     <SidebarProvider>
//       <AppSidebar user={currentUser.data} role={role} />
//       <SidebarInset>
//         <Header />
//         <div className="flex flex-1 flex-col p-4 overflow-auto">{children}</div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }
