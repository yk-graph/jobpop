/**
 * バリスタ求人10件をDBに登録するスクリプト
 *
 * 使い方:
 *   npx tsx scripts/seed/seedBaristaJobs.ts
 *
 * 処理内容:
 *   1. data/search-result.filtered-location.json から住所のある求人を10件抽出
 *   2. jobpop_inc. の会社にStoreを10件作成
 *   3. 各StoreにJobを作成
 *   4. 各StoreにEmployeeを作成（EMPLOYEE_USER_ID, EMPLOYEE_ROLEで設定）
 */

import { PrismaClient, EmploymentType, SalaryType, JobStatus, EmployeeRole } from '@jobpop/database'
import * as fs from 'fs'
import * as path from 'path'
import 'dotenv/config'

const prisma = new PrismaClient()
const GOOGLE_MAPS_API_KEY = process.env.PRIVATE_GOOGLE_MAPS_API_KEY

const INPUT_FILE = path.join(__dirname, '../../data/search-result.filtered-location.json')
const COMPANY_ID = 'jobpop_inc.'

// Employee設定（必要に応じて変更）
const EMPLOYEE_USER_ID = 'JzDbOjFzHABNDH3d03lUvJcjRXEGLCQJ'
const EMPLOYEE_ROLE = EmployeeRole.OWNER

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
    return null
  }

  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
  url.searchParams.set('address', address)
  url.searchParams.set('key', GOOGLE_MAPS_API_KEY)

  try {
    const response = await fetch(url.toString())
    const data = await response.json()

    if (data.status !== 'OK') {
      console.warn(`  ⚠️  Geocode failed for "${address}": ${data.status}`)
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
 * 住所からpostalCode, province, city, streetAddressを抽出
 */
function parseAddress(location: string): {
  postalCode: string
  province: string
  city: string
  streetAddress: string
} {
  const postalCodeMatch = location.match(/[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i)
  const postalCode = postalCodeMatch ? postalCodeMatch[0].toUpperCase() : 'V6B 1A1'

  const provinceMatch = location.match(/,\s*([A-Z]{2})(?:\s|,|$)/i)
  const province = provinceMatch ? provinceMatch[1].toUpperCase() : 'BC'

  const parts = location.split(',').map((p) => p.trim())
  let city = 'Vancouver'
  const streetAddress = parts[0] || location

  if (parts.length >= 2) {
    city = parts[1].replace(/\s*(BC|ON|AB|QC|MB|SK|NS|NB|PE|NL|NT|YT|NU)\s*/gi, '').trim() || 'Vancouver'
  }

  return { postalCode, province, city, streetAddress }
}

/**
 * jobTypeからEmploymentTypeを判定
 */
function getEmploymentType(jobType?: string): EmploymentType {
  if (!jobType) return EmploymentType.PART_TIME

  const type = jobType.toLowerCase()
  if (type.includes('full-time') || type.includes('full time')) return EmploymentType.FULL_TIME
  if (type.includes('contract')) return EmploymentType.CONTRACT
  if (type.includes('internship')) return EmploymentType.INTERNSHIP
  if (type.includes('freelance')) return EmploymentType.FREELANCE
  return EmploymentType.PART_TIME
}

/**
 * salaryからSalaryTypeを判定
 */
function getSalaryType(salary?: string): SalaryType {
  if (!salary) return SalaryType.HOURLY

  const s = salary.toLowerCase()
  if (s.includes('hour')) return SalaryType.HOURLY
  if (s.includes('month')) return SalaryType.MONTHLY
  if (s.includes('year') || s.includes('annual')) return SalaryType.ANNUAL
  return SalaryType.HOURLY
}

/**
 * 遅延を入れる（API制限対策）
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  console.log('=== バリスタ求人シードスクリプト ===\n')

  // 会社の存在確認
  const company = await prisma.company.findUnique({ where: { id: COMPANY_ID } })
  if (!company) {
    console.error(`❌ 会社が見つかりません: ${COMPANY_ID}`)
    process.exit(1)
  }
  console.log(`🏢 会社: ${company.name} (${COMPANY_ID})\n`)

  // 入力ファイルの読み込み
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ 入力ファイルが見つかりません: ${INPUT_FILE}`)
    process.exit(1)
  }

  const allJobs: JobListing[] = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'))
  console.log(`📂 読み込み: ${allJobs.length}件の求人データ`)

  // 住所があるものをフィルタし、10件選定
  const jobsWithLocation = allJobs.filter((job) => job.location && job.location.trim() !== '')
  console.log(`📍 住所あり: ${jobsWithLocation.length}件`)

  const selectedJobs = jobsWithLocation.slice(0, 10)
  console.log(`📋 選択した求人: ${selectedJobs.length}件\n`)

  // 各求人を処理
  let successCount = 0

  for (let i = 0; i < selectedJobs.length; i++) {
    const job = selectedJobs[i]
    console.log(`[${i + 1}/${selectedJobs.length}] ${job.title.replace(' - job post', '')}`)
    console.log(`   元の会社: ${job.company}`)
    console.log(`   住所: ${job.location}`)

    try {
      // 1. ジオコーディング
      const coords = await geocode(job.location)
      const lat = coords?.lat ?? 49.2827 + (Math.random() - 0.5) * 0.1
      const lng = coords?.lng ?? -123.1207 + (Math.random() - 0.5) * 0.1

      if (coords) {
        console.log(`   座標: lat=${lat.toFixed(4)}, lng=${lng.toFixed(4)}`)
      } else {
        console.log(`   座標: lat=${lat.toFixed(4)}, lng=${lng.toFixed(4)} (デフォルト)`)
      }

      // 2. 住所を解析
      const address = parseAddress(job.location)

      // 3. Store を作成（jobpop_inc.の下に）
      const storeName = job.title.replace(' - job post', '')
      const store = await prisma.store.create({
        data: {
          companyId: COMPANY_ID,
          name: storeName,
          lat: lat,
          lng: lng,
          postalCode: address.postalCode,
          province: address.province,
          city: address.city,
          streetAddress: address.streetAddress,
        },
      })
      console.log(`   店舗: ${store.name} (ID: ${store.id})`)

      // 4. Job を作成
      const jobRecord = await prisma.job.create({
        data: {
          storeId: store.id,
          mstExperienceId: 'foodBarista',
          title: job.title.replace(' - job post', ''),
          description: job.description,
          thumbnailUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=150&fit=crop&crop=center',
          salary: job.salary || '$18/hour',
          salaryType: getSalaryType(job.salary),
          employmentType: getEmploymentType(job.jobType),
          status: JobStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      })
      console.log(`   求人: ${jobRecord.title} (ID: ${jobRecord.id})`)

      // 5. Employee を作成（Storeに紐付け）
      const employee = await prisma.employee.create({
        data: {
          userId: EMPLOYEE_USER_ID,
          companyId: COMPANY_ID,
          storeId: store.id,
          role: EMPLOYEE_ROLE,
        },
      })
      console.log(`   従業員: ${employee.id} (Role: ${employee.role})`)

      successCount++
      console.log(`   ✅ 登録完了\n`)

      // レート制限対策
      if (i < selectedJobs.length - 1 && GOOGLE_MAPS_API_KEY) {
        await delay(300)
      }
    } catch (error) {
      console.error(`   ❌ エラー:`, error)
      console.log('')
    }
  }

  console.log('=== 完了 ===')
  console.log(`  成功: ${successCount}/${selectedJobs.length}件`)

  await prisma.$disconnect()
}

main().catch((error) => {
  console.error('💥 エラー:', error)
  process.exit(1)
})
