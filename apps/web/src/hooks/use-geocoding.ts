import { useState, useCallback } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'

/**
 * ジオコーディング結果の型
 */
export interface GeocodeResult {
  lat: number
  lng: number
  formattedAddress: string
}

/**
 * useGeocoding hookの戻り値
 */
interface UseGeocodingReturn {
  /** ジオコーディングを実行する関数 */
  geocode: (address: string) => Promise<GeocodeResult | null>
  /** ローディング状態 */
  isLoading: boolean
  /** エラー情報 */
  error: string | null
  /** 最後の結果 */
  result: GeocodeResult | null
}

/**
 * Google Maps Geocoding API を使用するReact hook
 *
 * @example
 * ```tsx
 * function AddressForm() {
 *   const { geocode, isLoading, error, result } = useGeocoding()
 *
 *   const handleSubmit = async (address: string) => {
 *     const coords = await geocode(address)
 *     if (coords) {
 *       console.log(`緯度: ${coords.lat}, 経度: ${coords.lng}`)
 *     }
 *   }
 *
 *   return (
 *     <div>
 *       {isLoading && <p>検索中...</p>}
 *       {error && <p>エラー: {error}</p>}
 *       {result && <p>住所: {result.formattedAddress}</p>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useGeocoding(): UseGeocodingReturn {
  const geocodingLib = useMapsLibrary('geocoding')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GeocodeResult | null>(null)

  const geocode = useCallback(
    async (address: string): Promise<GeocodeResult | null> => {
      if (!geocodingLib) {
        setError('Google Maps Geocoding ライブラリが読み込まれていません')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const geocoder = new geocodingLib.Geocoder()

        const response = await geocoder.geocode({ address })

        if (response.results.length === 0) {
          setError('住所が見つかりませんでした')
          setResult(null)
          return null
        }

        const firstResult = response.results[0]
        const location = firstResult.geometry.location

        const geocodeResult: GeocodeResult = {
          lat: location.lat(),
          lng: location.lng(),
          formattedAddress: firstResult.formatted_address,
        }

        setResult(geocodeResult)
        return geocodeResult
      } catch (err) {
        const message = err instanceof Error ? err.message : 'ジオコーディングに失敗しました'
        setError(message)
        setResult(null)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [geocodingLib]
  )

  return { geocode, isLoading, error, result }
}
