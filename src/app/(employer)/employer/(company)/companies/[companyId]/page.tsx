export default async function CompanyPage({ params }: { params: Promise<{ companyId: string }> }) {
  console.log('CompanyPage params:', params) // 追加: パラメータのログ出力

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">DashboardPage</h1>
    </div>
  )
}
