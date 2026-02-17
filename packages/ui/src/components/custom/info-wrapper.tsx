import { ReactNode } from 'react'

import { cn } from '../../utils'

interface InfoWrapperProps {
  children: ReactNode
  responsive?: boolean
}

export function InfoWrapper({ children, responsive = true }: InfoWrapperProps) {
  return (
    <dl className={cn('grid gap-4', responsive ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2')}>
      {children}
    </dl>
  )
}
