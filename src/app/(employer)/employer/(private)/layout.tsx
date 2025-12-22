import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

export default async function EmployerPrivateLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/employer/login')
  }

  return <div className="min-h-svh w-full">{children}</div>
}
