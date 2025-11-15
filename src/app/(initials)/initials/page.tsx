import { InitialProfileForm, InitialProfileProvider } from '@/components/form'
import { StepBar } from './_components/step-bar'

export default function InitialsPage() {
  return (
    <InitialProfileProvider>
      <StepBar />
      <InitialProfileForm />
    </InitialProfileProvider>
  )
}
