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
  country: string
  countryShort: string
  province: string
  provinceShort: string
  city: string
  streetAddress: string
  postalCode: string
  lat: number
  lng: number
}
