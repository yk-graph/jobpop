import { Page, BrowserContextOptions } from 'playwright'
import { chromium } from 'playwright-extra'
import stealth from 'puppeteer-extra-plugin-stealth'
import * as fs from 'fs'
import * as path from 'path'

import { JobListing, ScrapeOptions } from './types'
import { buildIndeedUrl, delay } from './utils'

// ステルスプラグインを適用（自動化検出を回避）
chromium.use(stealth())

// セッションファイルのパス
const SESSION_FILE = path.join(__dirname, 'indeed-session.json')

/** ジョブカードのリストを取得する */
async function getJobCardIds(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const cards = document.querySelectorAll('.job_seen_beacon a[data-jk]')
    const ids: string[] = []
    cards.forEach((card) => {
      const id = card.getAttribute('data-jk')
      if (id) ids.push(id)
    })
    return ids
  })
}

/** 詳細パネルから求人情報を抽出する */
async function extractJobFromDetailPanel(page: Page, jobId: string): Promise<JobListing | null> {
  // "show more" ボタンがあればクリックして展開（スキル、福利厚生、シフト）
  const showMoreSelectors = [
    '[aria-label="Skills"] button',
    '[aria-label="Shift and schedule"] button',
    '#benefits button',
  ]

  for (const selector of showMoreSelectors) {
    const buttons = await page.$$(selector)
    for (const btn of buttons) {
      const text = await btn.textContent()
      if (text?.includes('show more')) {
        await btn.click()
        await delay(300)
      }
    }
  }

  return page.evaluate((id) => {
    // タイトル
    const titleEl = document.querySelector('.jobsearch-JobInfoHeader-title span')
    if (!titleEl) return null

    // 会社名とURL
    const companyLink = document.querySelector('[data-testid="inlineHeader-companyName"] a') as HTMLAnchorElement | null
    const company = companyLink?.textContent?.trim() || ''
    const companyUrl = companyLink?.href

    // 場所
    const locationEl = document.querySelector('[data-testid="job-location"]')
    const location = locationEl?.textContent?.trim() || ''

    // 給与と雇用形態
    const salaryTypeEl = document.querySelector('#salaryInfoAndJobType')
    let salary: string | undefined
    let jobType: string | undefined

    // 雇用形態のパターン
    const jobTypePatterns = [
      'Part-time',
      'Full-time',
      'Contract',
      'Temporary',
      'Permanent',
      'Internship',
      'Co-op',
      'Freelance',
    ]

    if (salaryTypeEl) {
      const spans = salaryTypeEl.querySelectorAll('span')
      spans.forEach((span) => {
        const text = span.textContent?.trim() || ''
        // 給与は通常 $ や 数字を含む
        if (text.includes('$') || /\d/.test(text)) {
          salary = text
        } else if (text && jobTypePatterns.some((pattern) => text.includes(pattern))) {
          // 雇用形態（Part-time, Full-time など）
          // 先頭の "- " を除去
          jobType = text.replace(/^-\s*/, '').trim()
        }
      })
    }

    // Job Detailsセクションからも雇用形態を取得（フォールバック）
    if (!jobType) {
      const jobDetailsSection = document.querySelector('#jobDetailsSection')
      if (jobDetailsSection) {
        jobDetailsSection.querySelectorAll('button[data-testid$="-tile"]').forEach((btn) => {
          const testId = btn.getAttribute('data-testid')
          if (testId) {
            const value = testId.replace(/-tile$/, '')
            if (jobTypePatterns.some((pattern) => value.includes(pattern))) {
              jobType = value
            }
          }
        })
      }
    }

    // スキル（data-testid属性から取得）
    const skills: string[] = []
    const skillsSection = document.querySelector('[aria-label="Skills"]')
    if (skillsSection) {
      // button[data-testid="XXX-tile"] からスキル名を抽出
      skillsSection.querySelectorAll('button[data-testid$="-tile"]').forEach((btn) => {
        const testId = btn.getAttribute('data-testid')
        if (testId) {
          // "Customer service-tile" -> "Customer service"
          const skillName = testId.replace(/-tile$/, '')
          if (skillName) {
            skills.push(skillName)
          }
        }
      })
    }

    // 福利厚生
    const benefits: string[] = []
    document.querySelectorAll('#benefits ul li').forEach((el) => {
      const text = el.textContent?.trim()
      if (text && !text.includes('show')) benefits.push(text)
    })

    // シフト・スケジュール（data-testid属性から取得）
    const shiftAndSchedule: string[] = []
    const shiftSection = document.querySelector('[aria-label="Shift and schedule"]')
    if (shiftSection) {
      shiftSection.querySelectorAll('button[data-testid$="-tile"]').forEach((btn) => {
        const testId = btn.getAttribute('data-testid')
        if (testId) {
          const value = testId.replace(/-tile$/, '')
          if (value) {
            shiftAndSchedule.push(value)
          }
        }
      })
    }

    // 説明
    const descEl = document.querySelector('#jobDescriptionText')
    const description = descEl?.textContent?.trim() || ''

    // URL
    const url = window.location.href

    return {
      id,
      title: titleEl.textContent?.trim() || '',
      company,
      companyUrl,
      location,
      salary,
      jobType,
      skills,
      benefits,
      shiftAndSchedule,
      description,
      url,
    }
  }, jobId)
}

export async function scrapeIndeed(options: ScrapeOptions): Promise<JobListing[]> {
  const { query, location, pages = 1, radius, sort, fromage, jobType } = options
  const jobs: JobListing[] = []

  // セッションファイルの確認
  let storageState: unknown = undefined
  if (fs.existsSync(SESSION_FILE)) {
    console.log('✅ セッションファイルを読み込み中...')
    storageState = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'))
  } else {
    console.log('⚠️  セッションファイルが見つかりません（ログインなしで実行）')
    console.log('   スキル情報を取得するには先にログインしてください:')
    console.log('   npx tsx scripts/scraper/login.ts\n')
  }

  // デバッグ時は headless: false にして実際の動作を確認
  const browser = await chromium.launch({
    headless: false, // true に戻すと非表示で実行
    slowMo: 100, // 操作を遅くして人間らしく
    channel: 'chrome', // システムのChromeを使用
  })

  const context = await browser.newContext({
    storageState: storageState as BrowserContextOptions['storageState'],
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1366, height: 768 },
    locale: 'en-CA',
    timezoneId: 'America/Vancouver',
    // ボット検出回避のための追加設定
    extraHTTPHeaders: {
      'Accept-Language': 'en-CA,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    },
  })

  const page = await context.newPage()

  try {
    for (let pageNum = 0; pageNum < pages; pageNum++) {
      const start = pageNum * 10
      const url = buildIndeedUrl({
        q: query,
        l: location,
        start,
        radius,
        sort,
        fromage,
        jobType,
      })

      console.log(`\n📄 Fetching page ${pageNum + 1}: ${url}`)

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })

      // ページ読み込み後、人間らしいランダムな遅延（3-5秒）
      await delay(3000 + Math.random() * 2000)

      const pageTitle = await page.title()
      console.log('Page title:', pageTitle)

      // CAPTCHA/ブロック検出
      const pageContent = await page.content()
      if (
        pageContent.includes('Additional Verification Required') ||
        pageContent.includes('unusual traffic') ||
        pageTitle.includes('Security')
      ) {
        console.log('\n⚠️  ボット検出（CAPTCHA）が表示されました')
        console.log('   ブラウザを閉じて終了します。')
        console.log('\n   対処法：')
        console.log('   1. 10-15分待ってから再実行')
        console.log('   2. VPNを使用してIPを変更')
        console.log('   3. 通常のブラウザでIndeedにアクセスしてCAPTCHAを解決してから再実行')
        await browser.close()
        process.exit(1)
      }

      // ジョブカードのIDを取得
      const jobIds = await getJobCardIds(page)
      console.log(`Found ${jobIds.length} job cards on page ${pageNum + 1}`)

      // 各ジョブカードをクリックして詳細を抽出
      for (let i = 0; i < jobIds.length; i++) {
        const jobId = jobIds[i]
        console.log(`  [${i + 1}/${jobIds.length}] Extracting job ${jobId}...`)

        try {
          // ジョブカードをクリック
          const cardSelector = `a[data-jk="${jobId}"]`
          await page.click(cardSelector)

          // 詳細パネルの読み込みを待つ
          await page.waitForSelector('.jobsearch-JobInfoHeader-title', { timeout: 10000 })
          await delay(500)

          // クリック後のCAPTCHA検出
          const clickContent = await page.content()
          if (clickContent.includes('Additional Verification Required')) {
            console.log('\n⚠️  ボット検出（CAPTCHA）が表示されました。終了します。')
            await browser.close()
            process.exit(1)
          }

          // 詳細パネルから情報を抽出
          const job = await extractJobFromDetailPanel(page, jobId)
          if (job) {
            jobs.push(job)
            console.log(`    ✓ ${job.title} at ${job.company} (skills: ${job.skills.length})`)
          } else {
            console.log(`    ✗ Failed to extract job details`)
          }

          // レート制限対策（0.5-1秒のランダム遅延）
          await delay(500 + Math.random() * 500)
        } catch (error) {
          console.log(`    ✗ Error extracting job ${jobId}:`, error)
        }
      }

      console.log(`✓ Extracted ${jobs.length} jobs so far`)

      // 次のページへ移動する前の遅延
      if (pageNum < pages - 1) {
        await delay(2000 + Math.random() * 2000)
      }
    }
  } catch (error) {
    console.error('Scraping error:', error)
    throw error
  } finally {
    await browser.close()
  }

  return jobs
}

// CLI実行
async function main() {
  const fs = await import('fs')
  const path = await import('path')
  const args = process.argv.slice(2)

  // 使用例: npx tsx scripts/scraper/indeed.ts "Barista" "Vancouver, BC" --pages=2 --radius=25 --sort=date --fromage=last --jobType=part-time
  const query = args.find((arg) => !arg.startsWith('--')) || 'software developer'
  const location = args.filter((arg) => !arg.startsWith('--'))[1] || 'Vancouver, BC'

  const getOption = (name: string): string | undefined => {
    const arg = args.find((a) => a.startsWith(`--${name}=`))
    return arg?.split('=')[1]
  }

  const pages = parseInt(getOption('pages') || '1', 10)
  const radius = getOption('radius') ? parseInt(getOption('radius')!, 10) : undefined
  const sort = getOption('sort') as 'date' | 'relevance' | undefined

  // fromageは'last'または数値（1, 3, 7, 14）
  const fromageStr = getOption('fromage')
  const fromage = fromageStr
    ? fromageStr === 'last'
      ? 'last'
      : (parseInt(fromageStr, 10) as 1 | 3 | 7 | 14)
    : undefined

  const jobType = getOption('jobType') as
    | 'part-time'
    | 'full-time'
    | 'permanent'
    | 'contract'
    | 'temporary'
    | 'internship'
    | 'freelance'
    | undefined

  console.log(`Scraping Indeed for "${query}" in "${location}"`)
  console.log(`Options: pages=${pages}, radius=${radius}, sort=${sort}, fromage=${fromage}, jobType=${jobType}\n`)

  const jobs = await scrapeIndeed({ query, location, pages, radius, sort, fromage, jobType })

  console.log(`\nTotal: ${jobs.length} jobs found\n`)

  // 結果をJSONファイルに保存（既存データに追加）
  // クエリをファイル名に使用（小文字、スペースをハイフンに、特殊文字を除去）
  const sanitizedQuery = query
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  const outputDir = path.join(__dirname, '..', 'data')
  const outputPath = path.join(outputDir, `search-result-${sanitizedQuery}.json`)

  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // 既存データを読み込み
  let existingJobs: (JobListing & { createdAt: string })[] = []
  if (fs.existsSync(outputPath)) {
    try {
      existingJobs = JSON.parse(fs.readFileSync(outputPath, 'utf-8'))
      console.log(`📂 Existing jobs: ${existingJobs.length}`)
    } catch {
      console.log('⚠️  既存ファイルの読み込みに失敗。新規作成します。')
    }
  }

  // 既存のIDセットを作成
  const existingIds = new Set(existingJobs.map((job) => job.id))

  // 新しいジョブにcreatedAtを追加し、重複を除外
  const createdAt = new Date().toISOString()
  const newJobs = jobs.filter((job) => !existingIds.has(job.id)).map((job) => ({ ...job, createdAt }))

  console.log(`✨ New jobs: ${newJobs.length} (duplicates skipped: ${jobs.length - newJobs.length})`)

  // 既存データと新規データをマージ
  const allJobs = [...existingJobs, ...newJobs]

  fs.writeFileSync(outputPath, JSON.stringify(allJobs, null, 2), 'utf-8')
  console.log(`✓ Total jobs saved: ${allJobs.length} → ${outputPath}`)
}

main().catch(console.error)
