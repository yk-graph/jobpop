import { cn } from '@/lib/utils'

interface DividerLineProps {
  text?: string
  className?: string
}

export function DividerLine({ text = 'or', className }: DividerLineProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-background text-muted-foreground">{text}</span>
      </div>
    </div>
  )
}
