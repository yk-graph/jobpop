'use client'

import { Link } from 'react-scroll'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ScrollNavItem {
  label: string
  to: string
}

interface ScrollNavProps {
  items: ScrollNavItem[]
  containerId?: string
  className?: string
}

export function ScrollNav({ items, containerId = 'main-scroll-container', className }: ScrollNavProps) {
  return (
    <div className={cn('flex gap-4 overflow-x-auto scrollbar-hide', className)}>
      {items.map((item) => (
        <Button variant="outline" key={item.to}>
          <Link to={item.to} containerId={containerId} spy={true} smooth="easeInOutQuint" offset={-20} duration={1000}>
            {item.label}
          </Link>
        </Button>
      ))}
    </div>
  )
}
