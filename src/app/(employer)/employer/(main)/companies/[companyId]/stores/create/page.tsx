export default async function CreateStorePage({ params }: { params: Promise<{ companyId: string }> }) {
  const companyId = (await params).companyId

  return (
    <div>
      <h1>Create Store for Company ID: {companyId}</h1>
    </div>
  )
}
