import { COUNTRIES } from '@/constants/countries'

export type CountryCode = keyof typeof COUNTRIES
export type Country = (typeof COUNTRIES)[CountryCode]
