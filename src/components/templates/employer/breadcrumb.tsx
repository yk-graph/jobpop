'use client'

import { usePathname } from 'next/navigation'

import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export interface BreadcrumbSegment {
  label: string
  href?: string
}

interface BreadcrumbProps {
  customSegments?: BreadcrumbSegment[]
}

/**
 * パスから表示用のラベルを生成
 * 例: "job-postings" → "Job Postings"
 */
function formatSegmentLabel(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// 動的にパスから生成されるBreadcrumb、またはカスタムセグメントを表示
export function Breadcrumb({ customSegments }: BreadcrumbProps) {
  const pathname = usePathname()

  // カスタムセグメントが指定されている場合はそれを使用
  if (customSegments && customSegments.length > 0) {
    return (
      <BreadcrumbComponent>
        <BreadcrumbList>
          {customSegments.map((segment, index) => {
            const isLast = index === customSegments.length - 1

            return (
              <div key={segment.label} className="flex items-center gap-2">
                <BreadcrumbItem className={index === 0 ? 'hidden md:block' : ''}>
                  {isLast || !segment.href ? (
                    <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={segment.href}>{segment.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
              </div>
            )
          })}
        </BreadcrumbList>
      </BreadcrumbComponent>
    )
  }

  // パスから自動生成
  const segments = pathname.split('/').filter((segment) => segment !== '')

  // "employer" を除外して、dashboard以降のパスを取得
  const employerIndex = segments.findIndex((seg) => seg === 'employer')
  const pathSegments = employerIndex >= 0 ? segments.slice(employerIndex + 1) : segments

  // "dashboard" の場合はDashboardのみ表示
  if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === 'dashboard')) {
    return (
      <BreadcrumbComponent>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </BreadcrumbComponent>
    )
  }

  // "dashboard" を除外したセグメント
  const breadcrumbSegments = pathSegments[0] === 'dashboard' ? pathSegments.slice(1) : pathSegments

  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        {/* Dashboard へのリンク */}
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/employer/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />

        {/* 動的なセグメント */}
        {breadcrumbSegments.map((segment, index) => {
          const isLast = index === breadcrumbSegments.length - 1
          const href = `/employer/${breadcrumbSegments.slice(0, index + 1).join('/')}`

          return (
            <div key={segment} className="flex items-center gap-2">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{formatSegmentLabel(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{formatSegmentLabel(segment)}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          )
        })}
      </BreadcrumbList>
    </BreadcrumbComponent>
  )
}
