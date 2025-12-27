import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface InfoItemProps {
  label: string
  value: string | ReactNode
  icon?: LucideIcon
}

export function InfoItem({ label, value, icon: Icon }: InfoItemProps) {
  const displayValue = typeof value === 'string' && !value ? '-' : value

  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />}
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        {typeof displayValue === 'string' ? (
          <p className="text-sm text-muted-foreground">{displayValue}</p>
        ) : (
          displayValue
        )}
      </div>
    </div>
  )
}
