import { VisaType } from '@prisma/client'
import { CountryCode } from './country'

export interface ProfileFormData {
  // Step 1: Basic Info
  name: string
  countryCode: CountryCode
  birthYear: number
  visaType: VisaType

  // Step 2: Experience (to be added later)
  // experiences?: Experience[]

  // Step 3: Social Links
  bio?: string
  website?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  facebook?: string
  whatsapp?: string

  // Meta
  stepCount: number
}