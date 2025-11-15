'use client'

import { useFormContext } from 'react-hook-form'

import { InitialProfileStep1 } from './step-1'
import { InitialProfileStep2 } from './step-2'

export function InitialProfileForm() {
  const { watch } = useFormContext()

  const currentStep = watch('stepCount')

  if (currentStep === 1) {
    return <InitialProfileStep1 />
  }

  if (currentStep === 2) {
    return <InitialProfileStep2 />
  }
}
