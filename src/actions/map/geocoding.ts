'use server'

import { postalCodeSchema, PostalCodeSchemaType } from '@/lib/zod'
import { ServerActionResult } from '@/types'
import { ExtractedAddress, GeocodingResponse } from '@/types'
import { handleError } from '@/utils'

/**
 * 郵便番号から住所情報を取得する(Google Maps Geocoding API v3 を使用)
 * Google Maps Geocoding API を使用
 */
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

    // Google Maps Geocoding API v3 にリクエスト
    const endPoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${validatedPostalCode.postalCode}&region=${countryCode}&key=${apiKey}`
    const response = await fetch(endPoint)

    if (!response.ok) {
      return {
        success: false,
        message: `Geocoding API request failed: ${response.statusText}`,
      }
    }

    const data: GeocodingResponse = await response.json()

    // ステータスチェック
    if (data.status !== 'OK') {
      if (data.status === 'ZERO_RESULTS') {
        return {
          success: false,
          message: 'No results found for this postal code',
        }
      }
      if (data.status === 'OVER_QUERY_LIMIT') {
        return {
          success: false,
          message: 'API quota exceeded. Please try again later.',
        }
      }
      if (data.status === 'REQUEST_DENIED') {
        return {
          success: false,
          message: 'API request denied. Please check your API key configuration.',
        }
      }
      return {
        success: false,
        message: `Geocoding failed: ${data.status}`,
      }
    }

    // 結果が存在しない場合
    if (!data.results || data.results.length === 0) {
      return {
        success: false,
        message: 'No results found',
      }
    }

    // 最初の結果から住所情報を抽出
    const result = data.results[0]

    // address_components から必要な情報を抽出
    const extractComponent = (types: string[]): string => {
      const component = result.address_components.find((comp) => types.some((type) => comp.types.includes(type)))
      return component?.long_name || ''
    }

    const extractComponentShort = (types: string[]): string => {
      const component = result.address_components.find((comp) => types.some((type) => comp.types.includes(type)))
      return component?.short_name || ''
    }

    // streetAddressを組み立て (street_number + route)
    const streetNumber = extractComponent(['street_number'])
    const route = extractComponent(['route'])
    const streetAddress = streetNumber && route ? `${streetNumber} ${route}` : route || streetNumber || ''

    const extractedAddress: ExtractedAddress = {
      country: extractComponent(['country']),
      countryShort: extractComponentShort(['country']),
      province: extractComponent(['administrative_area_level_1']),
      provinceShort: extractComponentShort(['administrative_area_level_1']),
      city: extractComponent(['locality', 'sublocality', 'administrative_area_level_3']),
      streetAddress,
      postalCode: extractComponent(['postal_code']) || validatedPostalCode.postalCode,
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
    }

    return {
      success: true,
      message: 'Address retrieved successfully',
      data: extractedAddress,
    }
  } catch (error) {
    return handleError(error, 'getAddressFromPostalCode')
  }
}
