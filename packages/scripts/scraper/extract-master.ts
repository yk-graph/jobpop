import * as fs from 'fs'
import * as path from 'path'

const SEARCH_RESULT_FILE = path.join(__dirname, '..', 'data', 'search-result.json')
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'master-data.json')

interface JobListing {
  skills: string[]
  benefits: string[]
  shiftAndSchedule: string[]
}

interface MasterData {
  skills: string[]
  benefits: string[]
  shiftAndSchedule: string[]
  extractedAt: string
  sourceCount: number
}

/**
 * search-result.jsonからユニークな値を抽出する
 */
function extractUniqueValues(jobs: JobListing[]): Omit<MasterData, 'extractedAt' | 'sourceCount'> {
  const skills = [...new Set(jobs.flatMap((job) => job.skills || []))].sort()
  const benefits = [...new Set(jobs.flatMap((job) => job.benefits || []))].sort()
  const shiftAndSchedule = [...new Set(jobs.flatMap((job) => job.shiftAndSchedule || []))].sort()

  return { skills, benefits, shiftAndSchedule }
}

/**
 * マスターデータを生成してJSONファイルに出力する
 */
function generateMasterData(): MasterData {
  // search-result.jsonを読み込み
  if (!fs.existsSync(SEARCH_RESULT_FILE)) {
    console.error('❌ search-result.json が見つかりません')
    process.exit(1)
  }

  const jobs: JobListing[] = JSON.parse(fs.readFileSync(SEARCH_RESULT_FILE, 'utf-8'))
  console.log(`📂 読み込み: ${jobs.length}件の求人データ`)

  // ユニークな値を抽出
  const uniqueValues = extractUniqueValues(jobs)

  // マスターデータを作成
  const masterData: MasterData = {
    ...uniqueValues,
    extractedAt: new Date().toISOString(),
    sourceCount: jobs.length,
  }

  // 結果を表示
  console.log(`\n=== 抽出結果 ===`)
  console.log(`  Skills: ${masterData.skills.length}件`)
  console.log(`  Benefits: ${masterData.benefits.length}件`)
  console.log(`  Shift and Schedule: ${masterData.shiftAndSchedule.length}件`)

  // JSONファイルに出力
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(masterData, null, 2), 'utf-8')
  console.log(`\n✅ 保存しました: ${OUTPUT_FILE}`)

  return masterData
}

// CLI実行
generateMasterData()
