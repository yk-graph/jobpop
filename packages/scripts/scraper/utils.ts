export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export type JobType = 'part-time' | 'full-time' | 'permanent' | 'contract' | 'temporary' | 'internship' | 'freelance'
export type SortBy = 'date' | 'relevance'
export type Fromage = 'last' | 1 | 3 | 7 | 14

export interface IndeedSearchParams {
  q: string
  l: string
  radius?: number
  sort?: SortBy
  fromage?: Fromage // 投稿日数以内（'last', 1, 3, 7, 14）
  jobType?: JobType
  start?: number // ページネーション用（10, 20, 30...）※1ページ目は指定しない
}

const JOB_TYPE_CODES: Record<JobType, string> = {
  'part-time': '75GKK',
  'full-time': 'CF3CP',
  permanent: '5QWDV',
  contract: 'NJXCK',
  temporary: '4HKF7',
  internship: 'VDTG7',
  freelance: 'ZG59D',
}

export function buildIndeedUrl(params: IndeedSearchParams): string {
  const searchParams = new URLSearchParams({
    q: params.q,
    l: params.l,
  })

  if (params.radius) searchParams.set('radius', params.radius.toString())
  if (params.sort) searchParams.set('sort', params.sort)
  if (params.fromage) searchParams.set('fromage', params.fromage.toString())
  if (params.jobType) {
    searchParams.set('sc', `0kf:attr(${JOB_TYPE_CODES[params.jobType]});`)
  }

  // searchOnDesktopSerpを追加（ボット検出回避に有効）
  searchParams.set('from', 'searchOnDesktopSerp')

  // ページネーション：1ページ目はstartを設定しない、2ページ目以降は10, 20, 30...
  if (params.start && params.start > 0) {
    searchParams.set('start', params.start.toString())
  }

  return `https://ca.indeed.com/jobs?${searchParams.toString()}`
}
