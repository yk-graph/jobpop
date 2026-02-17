/**
 * Google Maps Geocoding API ユーティリティ
 *
 * 住所から緯度・経度を取得するサーバーサイド用ユーティリティ
 *
 * 使い方：
 *   const result = await geocode('5601 Stanley Park Drive, Vancouver, BC')
 *   console.log(result) // { lat: 49.3043, lng: -123.1443, formattedAddress: '...' }
 */

export interface GeocodeResult {
  lat: number
  lng: number
  formattedAddress: string
}

export interface GeocodeError {
  status: string
  message: string
}

const GOOGLE_MAPS_API_KEY = process.env.PRIVATE_GOOGLE_MAPS_API_KEY

/**
 * 住所から緯度・経度を取得する
 *
 * @param address - 住所文字列（例：「5601 Stanley Park Drive, Vancouver, BC」）
 * @returns 緯度・経度と正規化された住所
 * @throws GeocodeError - APIエラーの場合
 *
 * @example
 * ```ts
 * const result = await geocode('Vancouver, BC')
 * // { lat: 49.2827, lng: -123.1207, formattedAddress: 'Vancouver, BC, Canada' }
 * ```
 */
export async function geocode(address: string): Promise<GeocodeResult> {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY is not set in environment variables')
  }

  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
  url.searchParams.set('address', address)
  url.searchParams.set('key', GOOGLE_MAPS_API_KEY)

  const response = await fetch(url.toString())
  const data = await response.json()

  if (data.status !== 'OK') {
    const error: GeocodeError = {
      status: data.status,
      message: getErrorMessage(data.status),
    }
    throw error
  }

  const result = data.results[0]
  return {
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
    formattedAddress: result.formatted_address,
  }
}

/**
 * 複数の住所を一括でジオコーディングする
 *
 * @param addresses - 住所の配列
 * @param options - オプション設定
 * @returns 結果の配列（エラーの場合はnull）
 *
 * @example
 * ```ts
 * const results = await batchGeocode([
 *   'Vancouver, BC',
 *   'Toronto, ON',
 * ])
 * ```
 */
export async function batchGeocode(
  addresses: string[],
  options: { delayMs?: number; onProgress?: (current: number, total: number) => void } = {}
): Promise<(GeocodeResult | null)[]> {
  const { delayMs = 200, onProgress } = options
  const results: (GeocodeResult | null)[] = []

  for (let i = 0; i < addresses.length; i++) {
    try {
      const result = await geocode(addresses[i])
      results.push(result)
    } catch (error) {
      console.error(`Failed to geocode "${addresses[i]}":`, error)
      results.push(null)
    }

    onProgress?.(i + 1, addresses.length)

    // レート制限対策のための遅延
    if (i < addresses.length - 1) {
      await delay(delayMs)
    }
  }

  return results
}

/**
 * ステータスコードに対応するエラーメッセージを返す
 */
function getErrorMessage(status: string): string {
  const messages: Record<string, string> = {
    ZERO_RESULTS: '住所が見つかりませんでした',
    OVER_DAILY_LIMIT: 'APIの1日の使用上限に達しました',
    OVER_QUERY_LIMIT: 'リクエスト数が制限を超えました。しばらく待ってから再試行してください',
    REQUEST_DENIED: 'APIキーが無効、または権限がありません',
    INVALID_REQUEST: '住所が空または無効です',
    UNKNOWN_ERROR: 'サーバーエラーが発生しました。再試行してください',
  }
  return messages[status] || `予期しないエラー: ${status}`
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
