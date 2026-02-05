import { z } from 'zod'

export const postalCodeValidation = z
  .string()
  .min(1, 'postal code is required')
  .transform((val) => val.replace(/\s+/g, '').toUpperCase()) // スペースを削除して大文字に変換
  .refine((val) => val.length === 6, {
    message: 'postal code must be 6 characters',
  })
  .refine((val) => /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(val), {
    message: 'invalid postal code format (e.g., V6B4Y8)',
  })

export const postalCodeSchema = z.object({ postalCode: postalCodeValidation })

export type PostalCodeSchemaType = z.infer<typeof postalCodeSchema>
