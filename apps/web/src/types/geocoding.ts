// Google Maps Geocoding API のレスポンス型定義

export interface GeocodingAddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

export interface GeocodingGeometry {
  location: {
    lat: number
    lng: number
  }
  location_type: string
  viewport: {
    northeast: {
      lat: number
      lng: number
    }
    southwest: {
      lat: number
      lng: number
    }
  }
}

export interface GeocodingResult {
  address_components: GeocodingAddressComponent[]
  formatted_address: string
  geometry: GeocodingGeometry
  place_id: string
  types: string[]
}

export interface GeocodingResponse {
  results: GeocodingResult[]
  status: 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR'
}

// 抽出された住所情報
export interface ExtractedAddress {
  formattedAddress: string // Google APIから取得したフォーマット済み住所
  country: string // 国情報
  countryShort: string
  province: string // 州/都道府県情報
  provinceShort: string
  city: string // 市区町村情報
  streetAddress: string // 町名・番地（例: "4800 Kingsway"）
  postalCode: string // 郵便番号
  floor?: string // 階層情報（例: "B1", "Ground Floor"）
  unit?: string // 部屋番号・ユニット番号（例: "Shop 205", "Suite 100"）
  lat: number
  lng: number
  placeId?: string // Google Place ID（詳細情報の取得に使用可能）
}
