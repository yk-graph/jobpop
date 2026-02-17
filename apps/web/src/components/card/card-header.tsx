import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

import { Clipboard } from '@/components/common'
import { CardDescription, CardHeader as CardHeaderPrimitive, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CardHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  titleSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  copyValue?: string
  action?: ReactNode
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
}

export function CardHeader({ title, description, icon: Icon, titleSize = 'lg', copyValue, action }: CardHeaderProps) {
  return (
    <CardHeaderPrimitive>
      <div className="flex items-center justify-between">
        <CardTitle className={cn(sizeClasses[titleSize], Icon && 'flex items-center gap-2')}>
          {Icon && <Icon className="h-6 w-6" />}
          {title}
        </CardTitle>
        {action && <div>{action}</div>}
      </div>
      {description && (
        <CardDescription className="flex items-center gap-2">
          {description}
          {copyValue && <Clipboard value={copyValue} />}
        </CardDescription>
      )}
    </CardHeaderPrimitive>
  )
}
