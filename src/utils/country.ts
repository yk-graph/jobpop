import { COUNTRIES } from '@/constants/countries'
import type { CountryCode } from '@/types/country'

export function getCountryName(code: CountryCode, locale: 'en' | 'ja' = 'en'): string {
  const country = COUNTRIES[code]
  return locale === 'ja' ? country.nameJa : country.nameEn
}

export function isValidCountryCode(code: string): code is CountryCode {
  return code in COUNTRIES
}