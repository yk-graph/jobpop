import { InitialOwnerForm, InitialOwnerProvider } from '@/components/form'

export default function OwnerPage() {
  return (
    <div className="mx-auto max-w-4/5 sm:max-w-sm py-20">
      <InitialOwnerProvider>
        <InitialOwnerForm />
      </InitialOwnerProvider>
    </div>
  )
}
