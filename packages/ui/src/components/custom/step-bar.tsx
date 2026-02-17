'use client'

import { cn } from '../../utils'

interface StepBarProps {
  currentStep: number
  steps: {
    id: number
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  }[]
}

export function StepBar({ currentStep, steps }: StepBarProps) {
  return (
    <div className="flex items-center justify-center mb-10 sm:mb-20">
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
                  'bg-secondary border-secondary text-secondary-foreground dark:bg-white dark:border-white dark:text-black':
                    isCompleted,
                  'bg-secondary/10 border-secondary text-secondary dark:bg-white/10 dark:border-white dark:text-white':
                    isCurrent,
                  'bg-secondary/5 border-secondary/30 text-secondary/40 dark:bg-white/5 dark:border-white/30 dark:text-white/40':
                    isUpcoming,
                }
              )}
            >
              <step.icon className="w-6 h-6" />
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="w-16 mx-4">
                <div
                  className={cn('h-0.5 w-full transition-colors duration-200', {
                    'bg-secondary dark:bg-white': currentStep > step.id,
                    'bg-secondary/20 dark:bg-white/20': currentStep <= step.id,
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
