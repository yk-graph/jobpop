'use client'

import { User, Briefcase, Globe } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'

const steps = [
  {
    id: 1,
    icon: User,
  },
  {
    id: 2,
    icon: Briefcase,
  },
  {
    id: 3,
    icon: Globe,
  },
]

export function StepBar() {
  const { getValues } = useFormContext()
  const currentStep = getValues('stepCount') || 1

  return (
    <div className="flex items-center justify-center mb-20">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id
        const isCurrent = currentStep === step.id
        const isUpcoming = currentStep < step.id

        return (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                'relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors duration-200',
                {
                  'bg-secondary border-secondary text-secondary-foreground': isCompleted,
                  'bg-secondary/10 border-secondary text-secondary': isCurrent,
                  'bg-secondary/5 border-secondary/30 text-secondary/40': isUpcoming,
                }
              )}
            >
              <step.icon className="w-6 h-6" />

              {/* Check mark for completed steps */}
              {isCompleted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-secondary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="w-16 mx-4">
                <div
                  className={cn('h-0.5 w-full transition-colors duration-200', {
                    'bg-secondary': currentStep > step.id,
                    'bg-secondary/20': currentStep <= step.id,
                  })}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
