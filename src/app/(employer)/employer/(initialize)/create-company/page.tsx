import { MiddleScreenContainer } from '@/components/containers'
import { CreateCompanyForm } from '@/components/form'

export default function EmployerCreateCompanyPage() {
  return (
    <MiddleScreenContainer>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Create Company</h1>
        <p className="text-stone-300">Please input your company information to get started.</p>
      </div>
      <CreateCompanyForm />
    </MiddleScreenContainer>
  )
}
