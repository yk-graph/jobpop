/**
 * 住所から緯度・経度を取得するスクリプト
 *
 * 使い方:
 *   npx tsx scripts/scraper/geocode-locations.ts
 *
 * 出力:
 *   scripts/scraper/search-result.with-coords.json
 */

import * as fs from 'fs'
import * as path from 'path'
import 'dotenv/config'

const INPUT_FILE = path.join(__dirname, 'search-result.filtered-location.json')
const OUTPUT_FILE = path.join(__dirname, 'search-result.with-coords.json')

const GOOGLE_MAPS_API_KEY = process.env.PRIVATE_GOOGLE_MAPS_API_KEY

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

interface JobWithCoords extends JobListing {
  lat: number | null
  lng: number | null
  formattedAddress: string | null
}

interface GeocodeResult {
  lat: number
  lng: number
  formattedAddress: string
}

/**
 * Google Maps Geocoding APIを使用して住所から緯度・経度を取得
 */
async function geocode(address: string): Promise<GeocodeResult | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY is not set in environment variables')
  }

  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
  url.searchParams.set('address', address)
  url.searchParams.set('key', GOOGLE_MAPS_API_KEY)

  try {
    const response = await fetch(url.toString())
    const data = await response.json()

    if (data.status !== 'OK') {
      console.error(`  ❌ Geocode failed for "${address}": ${data.status}`)
      return null
    }

    const result = data.results[0]
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
    }
  } catch (error) {
    console.error(`  ❌ Error geocoding "${address}":`, error)
    return null
  }
}

/**
 * 遅延を入れる（API制限対策）
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * メイン処理
 */
async function main() {
  console.log('=== 住所ジオコーディングスクリプト ===\n')

  // APIキーの確認
  if (!GOOGLE_MAPS_API_KEY) {
    console.error('❌ GOOGLE_MAPS_API_KEY が設定されていません')
    console.error('   .env ファイルに GOOGLE_MAPS_API_KEY=your_key を追加してください')
    process.exit(1)
  }

  // 入力ファイルの読み込み
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ 入力ファイルが見つかりません: ${INPUT_FILE}`)
    process.exit(1)
  }

  const jobs: JobListing[] = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'))
  console.log(`📂 読み込み: ${jobs.length}件の求人データ\n`)

  // 既存の出力ファイルがあれば読み込み（中断した場合の再開用）
  let existingResults: JobWithCoords[] = []
  const processedIds = new Set<string>()

  if (fs.existsSync(OUTPUT_FILE)) {
    existingResults = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'))
    existingResults.forEach((job) => processedIds.add(job.id))
    console.log(`📂 既存データ: ${existingResults.length}件（スキップします）\n`)
  }

  // ジオコーディング処理
  const results: JobWithCoords[] = [...existingResults]
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i]

    // 既に処理済みならスキップ
    if (processedIds.has(job.id)) {
      continue
    }

    console.log(`[${i + 1}/${jobs.length}] ${job.company} - ${job.location}`)

    const coords = await geocode(job.location)

    if (coords) {
      results.push({
        ...job,
        lat: coords.lat,
        lng: coords.lng,
        formattedAddress: coords.formattedAddress,
      })
      successCount++
      console.log(`  ✅ lat: ${coords.lat}, lng: ${coords.lng}`)
    } else {
      results.push({
        ...job,
        lat: null,
        lng: null,
        formattedAddress: null,
      })
      failCount++
    }

    // 中間保存（5件ごと）
    if (results.length % 5 === 0) {
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8')
    }

    // レート制限対策（200ms待機）
    if (i < jobs.length - 1) {
      await delay(200)
    }
  }

  // 最終保存
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8')

  console.log('\n=== 完了 ===')
  console.log(`  成功: ${successCount}件`)
  console.log(`  失敗: ${failCount}件`)
  console.log(`  合計: ${results.length}件`)
  console.log(`\n📁 出力: ${OUTPUT_FILE}`)
}

main().catch(console.error)
