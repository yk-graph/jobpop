import * as fs from 'fs'
import * as path from 'path'

// ディレクトリパス
const ORIGIN_DIR = path.join(__dirname, '..', 'data', 'origin')
const SHAPE_DIR = path.join(__dirname, '..', 'data', 'shape')

// 出力ファイルパス
const UNIQUE_DATA_FILE = path.join(SHAPE_DIR, 'unique-id-data.json')
const LOCATION_DATA_FILE = path.join(SHAPE_DIR, 'location-data.json')
const MASTER_DATA_FILE = path.join(SHAPE_DIR, 'master-data.json')

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

interface MasterData {
  skills: string[]
  benefits: string[]
  shiftAndSchedule: string[]
  extractedAt: string
  sourceCount: number
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
 * origin配下のすべてのJSONファイルを読み込み、マージする
 */
function loadAllOriginData(): JobListing[] {
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

  const allJobs: JobListing[] = []

  for (const file of files) {
    const filePath = path.join(ORIGIN_DIR, file)
    try {
      const data: JobListing[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      console.log(`  - ${file}: ${data.length}件`)
      allJobs.push(...data)
    } catch (error) {
      console.warn(`  ⚠️ ${file}の読み込みに失敗: ${error}`)
    }
  }

  return allJobs
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
 * ユニークな値を抽出してマスターデータを作成
 */
function extractUniqueValues(jobs: JobListing[]): Omit<MasterData, 'extractedAt' | 'sourceCount'> {
  const skills = [...new Set(jobs.flatMap((job) => job.skills || []))].sort()
  const benefits = [...new Set(jobs.flatMap((job) => job.benefits || []))].sort()
  const shiftAndSchedule = [...new Set(jobs.flatMap((job) => job.shiftAndSchedule || []))].sort()

  return { skills, benefits, shiftAndSchedule }
}

/**
 * メイン処理
 */
function main(): void {
  console.log('\n=== データ処理開始 ===\n')

  // 出力ディレクトリを確保
  ensureDir(SHAPE_DIR)

  // Step 1: originからすべてのデータを読み込み
  const allJobs = loadAllOriginData()
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

  // Step 5: マスターデータを生成
  const uniqueValues = extractUniqueValues(uniqueJobs)
  const masterData: MasterData = {
    ...uniqueValues,
    extractedAt: new Date().toISOString(),
    sourceCount: uniqueJobs.length,
  }

  console.log(`\n=== マスターデータ ===`)
  console.log(`  Skills: ${masterData.skills.length}件`)
  console.log(`  Benefits: ${masterData.benefits.length}件`)
  console.log(`  Shift and Schedule: ${masterData.shiftAndSchedule.length}件`)

  fs.writeFileSync(MASTER_DATA_FILE, JSON.stringify(masterData, null, 2), 'utf-8')
  console.log(`\n✅ 保存: ${MASTER_DATA_FILE}`)

  console.log('\n=== 処理完了 ===\n')
}

// CLI実行
main()
