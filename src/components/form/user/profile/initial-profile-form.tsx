'use client'

import { useFormContext } from 'react-hook-form'

import { InitialProfileStep1 } from './step-1'
import { InitialProfileStep2 } from './step-2'
import { InitialProfileStep3 } from './step-3'

export function InitialProfileForm() {
  const { watch } = useFormContext()

  const currentStep = watch('stepCount')

  if (currentStep === 1) {
    return <InitialProfileStep1 />
  }

  if (currentStep === 2) {
    return <InitialProfileStep2 />
  }

  if (currentStep === 3) {
    return <InitialProfileStep3 />
  }

  return null
}
