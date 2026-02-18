import * as fs from 'fs'
import * as path from 'path'

// ディレクトリパス
const ORIGIN_DIR = path.join(__dirname, '..', 'data', 'origin')
const SHAPE_DIR = path.join(__dirname, '..', 'data', 'shape')

// 出力ファイルパス
const UNIQUE_DATA_FILE = path.join(SHAPE_DIR, 'unique-id-data.json')
const LOCATION_DATA_FILE = path.join(SHAPE_DIR, 'location-data.json')
const REPORT_FILE = path.join(SHAPE_DIR, 'report.json')

interface JobListing {
  id: string
  title: string
  company: string
  companyUrl?: string
  location: string
  salary?: string
  jobType?: string
  skills: string[]
  benefits: string[]
  shiftAndSchedule: string[]
  description: string
  url: string
  createdAt?: string
}

interface OriginFileData {
  query: string
  jobs: JobListing[]
}

interface ReportData {
  skills: Record<string, string[]>
  benefits: string[]
  shiftAndSchedule: string[]
  reports: {
    resultCounts: number
    uniqueCounts: number
    locationCounts: number
    reportDate: string
  }[]
}

/**
 * ディレクトリが存在しない場合は作成
 */
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`📁 ディレクトリ作成: ${dir}`)
  }
}

/**
 * ファイル名からクエリ名を抽出
 * search-result-barista.json → barista
 */
function extractQueryFromFilename(filename: string): string {
  return filename.replace(/^search-result-/, '').replace(/\.json$/, '')
}

/**
 * origin配下のすべてのJSONファイルを読み込み、クエリ別にデータを返す
 */
function loadAllOriginDataWithQuery(): OriginFileData[] {
  if (!fs.existsSync(ORIGIN_DIR)) {
    console.error(`❌ originディレクトリが見つかりません: ${ORIGIN_DIR}`)
    process.exit(1)
  }

  const files = fs.readdirSync(ORIGIN_DIR).filter((f) => f.endsWith('.json'))

  if (files.length === 0) {
    console.error('❌ originディレクトリにJSONファイルがありません')
    process.exit(1)
  }

  console.log(`📂 ${files.length}個のファイルを読み込み中...`)

  const results: OriginFileData[] = []

  for (const file of files) {
    const filePath = path.join(ORIGIN_DIR, file)
    const query = extractQueryFromFilename(file)
    try {
      const jobs: JobListing[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      console.log(`  - ${file}: ${jobs.length}件`)
      results.push({ query, jobs })
    } catch (error) {
      console.warn(`  ⚠️ ${file}の読み込みに失敗: ${error}`)
    }
  }

  return results
}

/**
 * IDの重複を除去してユニークなデータを返す
 */
function deduplicateById(jobs: JobListing[]): JobListing[] {
  const seen = new Map<string, JobListing>()

  for (const job of jobs) {
    // 同じIDがあれば後のデータで上書き（新しいデータを優先）
    seen.set(job.id, job)
  }

  return Array.from(seen.values())
}

/**
 * ロケーション情報があるかどうかを判定
 * - locationが空文字でない
 * - または郵便番号パターン（カナダ: A1A 1A1）が含まれている
 */
function hasValidLocation(job: JobListing): boolean {
  if (!job.location || job.location.trim() === '') {
    return false
  }

  // カナダの郵便番号パターン: A1A 1A1 または A1A1A1
  const postalCodePattern = /[A-Z]\d[A-Z]\s?\d[A-Z]\d/i

  // locationが空でないか、郵便番号が含まれていればtrue
  return job.location.trim() !== '' || postalCodePattern.test(job.location)
}

/**
 * クエリ別にスキルをグループ化
 */
function groupSkillsByQuery(originData: OriginFileData[]): Record<string, string[]> {
  const skillsByQuery: Record<string, string[]> = {}

  for (const { query, jobs } of originData) {
    const skills = [...new Set(jobs.flatMap((job) => job.skills || []))].sort()
    skillsByQuery[query] = skills
  }

  return skillsByQuery
}

/**
 * メイン処理
 */
function main(): void {
  console.log('\n=== データ処理開始 ===\n')

  // 出力ディレクトリを確保
  ensureDir(SHAPE_DIR)

  // Step 1: originからすべてのデータをクエリ別に読み込み
  const originData = loadAllOriginDataWithQuery()
  const allJobs = originData.flatMap((d) => d.jobs)
  console.log(`\n📊 合計: ${allJobs.length}件のデータを読み込み`)

  // Step 2: IDの重複を除去
  const uniqueJobs = deduplicateById(allJobs)
  const duplicateCount = allJobs.length - uniqueJobs.length
  console.log(`\n🔄 重複除去: ${duplicateCount}件の重複を削除`)
  console.log(`   ユニーク件数: ${uniqueJobs.length}件`)

  // Step 3: unique-id-data.jsonとして保存
  fs.writeFileSync(UNIQUE_DATA_FILE, JSON.stringify(uniqueJobs, null, 2), 'utf-8')
  console.log(`\n✅ 保存: ${UNIQUE_DATA_FILE}`)

  // Step 4: ロケーション情報があるデータを抽出
  const locationJobs = uniqueJobs.filter(hasValidLocation)
  console.log(`\n📍 ロケーション情報あり: ${locationJobs.length}件`)

  fs.writeFileSync(LOCATION_DATA_FILE, JSON.stringify(locationJobs, null, 2), 'utf-8')
  console.log(`✅ 保存: ${LOCATION_DATA_FILE}`)

  // Step 5: レポートデータを生成
  const skillsByQuery = groupSkillsByQuery(originData)
  const benefits = [...new Set(uniqueJobs.flatMap((job) => job.benefits || []))].sort()
  const shiftAndSchedule = [...new Set(uniqueJobs.flatMap((job) => job.shiftAndSchedule || []))].sort()

  const reportData: ReportData = {
    skills: skillsByQuery,
    benefits,
    shiftAndSchedule,
    reports: [
      {
        resultCounts: allJobs.length,
        uniqueCounts: uniqueJobs.length,
        locationCounts: locationJobs.length,
        reportDate: new Date().toISOString().split('T')[0],
      },
    ],
  }

  console.log(`\n=== レポートデータ ===`)
  console.log(`  Skills: ${Object.keys(skillsByQuery).length}クエリ分`)
  console.log(`  Benefits: ${benefits.length}件`)
  console.log(`  Shift and Schedule: ${shiftAndSchedule.length}件`)

  fs.writeFileSync(REPORT_FILE, JSON.stringify(reportData, null, 2), 'utf-8')
  console.log(`\n✅ 保存: ${REPORT_FILE}`)

  console.log('\n=== 処理完了 ===\n')
}

// CLI実行
main()
