import { chromium } from 'playwright-extra'
import stealth from 'puppeteer-extra-plugin-stealth'
import * as path from 'path'
import * as fs from 'fs'

chromium.use(stealth())

const SESSION_FILE = path.join(__dirname, 'indeed-session.json')

async function login() {
  console.log('=== Indeed ログインスクリプト ===\n')

  // 一時的なプロファイルを使用（通常のChromeを閉じる必要なし）
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    slowMo: 100,
    channel: 'chrome',
    viewport: { width: 1366, height: 768 },
  })

  const page = context.pages()[0] || (await context.newPage())

  try {
    // Indeedのログインページにアクセス
    console.log('Indeedにアクセス中...')
    await page.goto('https://secure.indeed.com/account/login', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })

    console.log('\n╔════════════════════════════════════════════════════════════╗')
    console.log('║  ブラウザでIndeedにログインしてください                    ║')
    console.log('║  ログイン完了後、ターミナルでEnterキーを押してください     ║')
    console.log('╚════════════════════════════════════════════════════════════╝\n')

    // ユーザーがログインするのを待つ
    await waitForEnter()

    // ログイン状態を確認
    const cookies = await context.cookies()

    if (cookies.length > 0) {
      // セッション情報を保存
      const storageState = await context.storageState()
      fs.writeFileSync(SESSION_FILE, JSON.stringify(storageState, null, 2))
      console.log(`\n✅ セッションを保存しました: ${SESSION_FILE}`)
      console.log(`   Cookies: ${cookies.length}件`)
    } else {
      console.log('\n⚠️  Cookieが見つかりません。ログインが完了しているか確認してください。')
    }
  } catch (error) {
    console.error('エラー:', error)
  } finally {
    await context.close()
    console.log('\nブラウザを閉じました。')
  }
}

function waitForEnter(): Promise<void> {
  return new Promise((resolve) => {
    process.stdin.setRawMode?.(false)
    process.stdin.resume()
    process.stdin.once('data', () => {
      resolve()
    })
  })
}

login()
