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

// パスから表示用のラベルを生成
// 例: "jobpop_inc" → "Jobpop Inc", "job-postings" → "Job Postings"
function formatSegmentLabel(segment: string): string {
  return segment
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// パスから動的に生成されるBreadcrumb
export function Breadcrumb() {
  const pathname = usePathname()

  // パスから自動生成
  // 例: /employer/companies/jobpop_inc./stores → ['employer', 'companies', 'jobpop_inc.', 'stores']
  const segments = pathname.split('/').filter((segment) => segment !== '')

  // "employer" と "companies" を除外して、companyId以降のパスを取得
  // 例: ['jobpop_inc.', 'stores'] または ['jobpop_inc.']
  const companiesIndex = segments.findIndex((seg) => seg === 'companies')
  const pathSegments = companiesIndex >= 0 ? segments.slice(companiesIndex + 1) : segments

  // パスがない場合（通常発生しない）
  if (pathSegments.length === 0) {
    return (
      <BreadcrumbComponent>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </BreadcrumbComponent>
    )
  }

  // companyId を取得（最初のセグメント）
  const companyId = pathSegments[0]
  const companyBasePath = `/employer/companies/${companyId}`

  // companyId 以降のセグメント（stores, jobs など）
  const breadcrumbSegments = pathSegments.slice(1)

  // トップページ（/employer/companies/[companyId]）の場合は会社名のみ表示
  if (breadcrumbSegments.length === 0) {
    return (
      <BreadcrumbComponent>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{formatSegmentLabel(companyId)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </BreadcrumbComponent>
    )
  }

  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        {/* 会社名（トップページへのリンク） */}
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={companyBasePath}>{formatSegmentLabel(companyId)}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />

        {/* 動的なセグメント（stores, jobs など） */}
        {breadcrumbSegments.map((segment, index) => {
          const isLast = index === breadcrumbSegments.length - 1
          const href = `${companyBasePath}/${breadcrumbSegments.slice(0, index + 1).join('/')}`

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
