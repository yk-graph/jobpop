import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

import { Clipboard } from '@/components/common'

interface InfoItemProps {
  label: string
  value: string | ReactNode
  icon?: LucideIcon
  copyValue?: string
}

export function InfoItem({ label, value, icon: Icon, copyValue }: InfoItemProps) {
  const displayValue = typeof value === 'string' && !value ? '-' : value

  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />}
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        {typeof displayValue === 'string' ? (
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{displayValue}</p>
            {copyValue && <Clipboard value={copyValue} className="text-muted-foreground" />}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {displayValue}
            {copyValue && <Clipboard value={copyValue} className="text-muted-foreground" />}
          </div>
        )}
      </div>
    </div>
  )
}
