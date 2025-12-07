import { InitialProfileForm, InitialProfileProvider } from '@/components/form'
import { StepBar } from './_components/step-bar'

export default function InitialPage() {
  return (
    <div className="mx-auto max-w-4/5 sm:max-w-sm py-20">
      <InitialProfileProvider>
        <StepBar />
        <InitialProfileForm />
      </InitialProfileProvider>
    </div>
  )
}
