import { redirect } from 'next/navigation'

import { getCachedSession } from '@/actions'

export default async function EmployerPrivateLayout({ children }: { children: React.ReactNode }) {
  const session = await getCachedSession()

  if (!session?.user?.id) {
    redirect('/employer/login')
  }

  return <div className="min-h-svh w-full">{children}</div>
}
