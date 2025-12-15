import { getCurrentRole } from '@/actions'

export default async function DashboardPage() {
  const currentRole = await getCurrentRole()

  return (
    <div className="flex w-full flex-col items-center justify-center max-w-4/5 gap-y-8 sm:max-w-sm">
      <h1 className="text-2xl font-bold">Employer Dashboard</h1>
      <div>Current Role: {currentRole.success ? currentRole.data : 'Unknown'}</div>
    </div>
  )
}
