export default async function DashboardPage({ params }: { params: Promise<{ companyId: string }> }) {
  console.log('DashboardPage params:', params) // 追加: パラメータのログ出力

  return <h1 className="text-4xl font-bold">DashboardPage</h1>
}
