'use client'

import { useCallback } from 'react'

import { Button } from '../shadcn/button'
import { cn } from '../../utils'

interface ScrollNavItem {
  label: string
  to: string
}

interface ScrollNavProps {
  items: ScrollNavItem[]
  containerId: string
  offset?: number
  className?: string
}

export function ScrollNav({ items, containerId, offset = -20, className }: ScrollNavProps) {
  const handleClick = useCallback(
    (targetId: string) => {
      const element = document.getElementById(targetId)
      const container = document.getElementById(containerId)

      if (!element) return

      if (container) {
        // コンテナ内でのスクロール
        const elementPosition = element.offsetTop - container.offsetTop
        container.scrollTo({
          top: elementPosition + offset,
          behavior: 'smooth',
        })
      } else {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    [containerId, offset]
  )

  return (
    <div className={cn('flex gap-4 overflow-x-auto scrollbar-hide', className)}>
      {items.map((item) => (
        <Button variant="outline" key={item.to} onClick={() => handleClick(item.to)}>
          {item.label}
        </Button>
      ))}
    </div>
  )
}
