'use server'

import { postalCodeSchema, PostalCodeSchemaType } from '@/lib/zod'
import { ExtractedAddress, GeocodingResponse, GeocodingResult, ServerActionResult } from '@/types'
import { handleError } from '@/utils'

const GOOGLE_GEOCODING_API_BASE = 'https://maps.googleapis.com/maps/api/geocode/json'

// Geocoding APIのレスポンスを検証し、エラーの場合は適切なメッセージを返す
function validateGeocodingResponse(data: GeocodingResponse, context: string) {
  if (data.status !== 'OK') {
    switch (data.status) {
      case 'ZERO_RESULTS':
        return `${context}: No results found`
      case 'OVER_QUERY_LIMIT':
        return `${context}: API quota exceeded. Please try again later.`
      case 'REQUEST_DENIED':
        return `${context}: API request denied. Please check your API key configuration.`
      case 'INVALID_REQUEST':
        return `${context}: Invalid request. Please check the parameters.`
      case 'UNKNOWN_ERROR':
        return `${context}: Unknown error occurred. Please try again.`
      default:
        return `${context}: Geocoding failed with status ${data.status}`
    }
  }

  if (!data.results || data.results.length === 0) {
    return `${context}: No results found`
  }
}

// Google Geocoding APIにリクエストを送信し、レスポンスを検証する
async function fetchGeocodingAPI(url: string, context: string): Promise<ServerActionResult<GeocodingResult>> {
  const response = await fetch(url)

  if (!response.ok) {
    return {
      success: false,
      message: `${context}: API request failed - ${response.statusText}`,
    }
  }

  const data: GeocodingResponse = await response.json()

  // ステータスチェック
  const validationError = validateGeocodingResponse(data, context)
  if (validationError) {
    return {
      success: false,
      message: validationError,
    }
  }

  return {
    success: true,
    message: `${context}: Successfully retrieved data`,
    data: data.results[0],
  }
}

// 住所コンポーネント抽出用のヘルパー関数を作成
function createAddressComponentExtractor(result: GeocodingResult) {
  return {
    extractLong: (types: string[]): string => {
      const component = result.address_components.find((comp) => types.some((type) => comp.types.includes(type)))
      return component?.long_name || ''
    },
    extractShort: (types: string[]): string => {
      const component = result.address_components.find((comp) => types.some((type) => comp.types.includes(type)))
      return component?.short_name || ''
    },
  }
}

// 抽出した住所情報を組み立てる
function buildExtractedAddress(
  result: GeocodingResult,
  originalPostalCode: string,
  originalLat: number,
  originalLng: number
): ExtractedAddress {
  const { extractLong, extractShort } = createAddressComponentExtractor(result)

  // streetAddressを組み立て (street_number + route)
  const streetNumber = extractLong(['street_number'])
  const route = extractLong(['route'])
  const streetAddress = streetNumber && route ? `${streetNumber} ${route}` : route || streetNumber || ''

  // 建物内部情報を抽出（取得可能な場合）
  const floor = extractLong(['floor']) || undefined
  const unit = extractLong(['subpremise']) || undefined

  return {
    formattedAddress: result.formatted_address,
    country: extractLong(['country']),
    countryShort: extractShort(['country']),
    province: extractLong(['administrative_area_level_1']),
    provinceShort: extractShort(['administrative_area_level_1']),
    city: extractLong(['locality', 'sublocality', 'administrative_area_level_3']),
    streetAddress,
    postalCode: extractLong(['postal_code']) || originalPostalCode,
    floor,
    unit,
    lat: originalLat,
    lng: originalLng,
    placeId: result.place_id,
  }
}

// 郵便番号から住所情報を取得するサーバーアクション
export async function getAddressFromPostalCode(
  postalCode: PostalCodeSchemaType,
  countryCode: string = 'CA'
): Promise<ServerActionResult<ExtractedAddress>> {
  try {
    // APIキーの確認
    const apiKey = process.env.PRIVATE_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      return {
        success: false,
        message: 'Google Maps API key is not configured',
      }
    }

    // 郵便番号のバリデーション
    const validatedPostalCode = postalCodeSchema.parse(postalCode)

    // 1. 郵便番号から住所情報を取得
    const addressURL = `${GOOGLE_GEOCODING_API_BASE}?address=${validatedPostalCode.postalCode}&region=${countryCode}&key=${apiKey}`
    const addressResult = await fetchGeocodingAPI(addressURL, 'Postal code lookup')

    if (!addressResult.success || !addressResult.data) {
      return addressResult
    }

    const { lat, lng } = addressResult.data.geometry.location

    // 2. 緯度経度から詳細な住所情報を取得
    const detailURL = `${GOOGLE_GEOCODING_API_BASE}?latlng=${lat},${lng}&key=${apiKey}`
    const detailResult = await fetchGeocodingAPI(detailURL, 'Detailed address lookup')

    // 詳細情報が取得できればそれを使用、失敗したら元の結果を使用
    const finalResult = detailResult.success && detailResult.data ? detailResult.data : addressResult.data

    // 3. 住所情報を抽出
    const extractedAddress = buildExtractedAddress(finalResult, validatedPostalCode.postalCode, lat, lng)

    return {
      success: true,
      message: 'Address retrieved successfully',
      data: extractedAddress,
    }
  } catch (error) {
    return handleError(error, 'getAddressFromPostalCode')
  }
}
