import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

import { CardDescription, CardHeader as CardHeaderPrimitive, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CardHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  titleSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  action?: ReactNode
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
}

export function CardHeader({
  title,
  description,
  icon: Icon,
  titleSize = 'lg',
  action,
}: CardHeaderProps) {
  if (action) {
    return (
      <CardHeaderPrimitive>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className={cn(sizeClasses[titleSize], Icon && 'flex items-center gap-2')}>
              {Icon && <Icon className="h-6 w-6" />}
              {title}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action}
        </div>
      </CardHeaderPrimitive>
    )
  }

  return (
    <CardHeaderPrimitive>
      <CardTitle className={cn(sizeClasses[titleSize], Icon && 'flex items-center gap-2')}>
        {Icon && <Icon className="h-6 w-6" />}
        {title}
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeaderPrimitive>
  )
}
