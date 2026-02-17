import { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@jobpop/ui'

type ThumbnailSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type ThumbnailAspect = 'square' | 'video'
type ThumbnailRounded = 'none' | 'lg' | 'full'

const sizeClasses: Record<ThumbnailSize, string> = {
  xs: 'w-12',
  sm: 'w-16',
  md: 'w-24',
  lg: 'w-32',
  xl: 'w-48',
}

const aspectClasses: Record<ThumbnailAspect, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
}

const roundedClasses: Record<ThumbnailRounded, string> = {
  none: 'rounded-none',
  lg: 'rounded-lg',
  full: 'rounded-full',
}

interface ThumbnailWithNameCardProps {
  name: string
  thumbnailUrl?: string | null
  href?: string
  size: ThumbnailSize
  aspect: ThumbnailAspect
  rounded: ThumbnailRounded
  fallbackIcon: LucideIcon
  className?: string
}

export function ThumbnailWithNameCard({
  name,
  thumbnailUrl,
  href,
  size,
  aspect,
  rounded,
  fallbackIcon: FallbackIcon,
  className,
}: ThumbnailWithNameCardProps) {
  const containerClasses = cn(sizeClasses[size], aspectClasses[aspect], roundedClasses[rounded])

  const content = (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className={cn('relative overflow-hidden bg-muted flex items-center justify-center', containerClasses)}>
        {thumbnailUrl ? (
          <Image src={thumbnailUrl} alt={name} fill className="object-cover" />
        ) : (
          <FallbackIcon className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <p className="text-sm font-medium text-center line-clamp-2">{name}</p>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="group transition-opacity hover:opacity-80">
        {content}
      </Link>
    )
  }

  return content
}
