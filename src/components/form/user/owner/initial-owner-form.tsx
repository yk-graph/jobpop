'use client'

import { useFormContext } from 'react-hook-form'

import { InitialOwnerStep1 } from './step-1'
import { InitialOwnerStep2 } from './step-2'
import { InitialOwnerStep3 } from './step-3'

export function InitialOwnerForm() {
  const { watch } = useFormContext()

  const currentStep = watch('stepCount')

  if (currentStep === 1) {
    return <InitialOwnerStep1 />
  }

  if (currentStep === 2) {
    return <InitialOwnerStep2 />
  }

  if (currentStep === 3) {
    return <InitialOwnerStep3 />
  }

  return null
}
